import './style.scss';
import tpl from './tpl.html';
import { readFile, mergePageConfig } from './util';
import { sleep, queryPath } from '@native/utils/util';
import { AppManager } from '@native/core/appManager/appManager';
import { Bridge } from '@native/core/bridge';
import { JSCore } from '@native/core/jscore';

export class MiniAppSandbox {
  constructor(opts) {
    this.appInfo = opts;
    this.parent = null;
    this.appConfig = null;
    this.bridgeList = [];
    this.bridges = {};
    this.jscore = new JSCore();
    this.jscore.parent = this;
    this.webViewContainer = null;
    // webView动画
    this.webviewAnimaEnd = true;

    this.el = document.createElement('div');
    this.el.classList.add('wx-native-view');
    this.jscore.addEventListener('message', this.jscoreMessageHandler.bind(this));
  }
  viewDidLoad() {
    this.initPageFrame();
    this.webViewContainer = this.el.querySelector('.wx-mini-app__webviews');
    this.showLaunchScreen();
    this.bindCloseEvent();
    this.initApp();
  }

  async initApp() {
    await this.jscore.init();
    //TODO: 没有实现小程序云托管平台 所以使用本地资源
    // 1. 拉去小程序的资源
    await sleep(1000);

    // 2. 读取配置文件
    const configPath = `${this.appInfo.appId}/config.json`;
    const configContent = await readFile(configPath);
    this.appConfig = JSON.parse(configContent);
    // 3. 设置状态栏的颜色模式
    const entryPagePath = this.appInfo.pagePath || this.appConfig.app.entryPagePath;
    this.updateTargetPageColorStyle(entryPagePath);
    // 4. 创建通信桥 Bridge
    const pageConfig = this.appConfig.modules[entryPagePath];
    const entryPageBridge = await this.createBridge({
      jscore: this.jscore,
      isRoot: true,
      appId: this.appInfo.appId,
      pagePath: entryPagePath,
      query: this.appInfo.query,
      scene: this.appInfo.scene,
      pages: this.appConfig.app.pages,
      configInfo: mergePageConfig(this.appConfig.app, pageConfig),
    });
    this.bridgeList.push(entryPageBridge);
    this.bridges[entryPageBridge.id] = entryPageBridge;
    // 5. 触发应用初始化逻辑
    entryPageBridge.start();
    // 6. 隐藏初始化loading动画
    this.hiddenLaunchScreen();
  }

  async createBridge(opts) {
    const bridge = new Bridge(opts);
    bridge.parent = this;
    await bridge.init();
    return bridge;
  }

  initPageFrame() {
    this.el.innerHTML = tpl;
  }

  onPresentIn() {
    const currentBridge = this.bridgeList[this.bridgeList.length - 1];
    if (currentBridge) {
      currentBridge.appShow();
      currentBridge.pageShow();
    }
  }

  onPresentOut() {
    const currentBridge = this.bridgeList[this.bridgeList.length - 1];
    if (currentBridge) {
      currentBridge.appHide();
      currentBridge.pageHide();
    }
  }

  jscoreMessageHandler(msg) {
    const { type, body } = msg;
    if (type !== 'triggerWXApi') {
      return;
    }
    const { apiName, params } = body;
    this[apiName](params);
  }

  navigateTo(params) {
    const { url } = params;
    const { query, pagePath } = queryPath(url);
    this.openPage({ pagePath, query });
  }

  bindCloseEvent() {
    const closeBtn = this.el.querySelector('.wx-mini-app-navigation__actions-close');

    closeBtn.onclick = () => {
      AppManager.closeApp(this);
    };
  }

  // 设置指定页面状态栏的颜色
  updateTargetPageColorStyle(pagePath) {
    const pageConfig = this.appConfig.modules[pagePath];
    const mergeConfig = mergePageConfig(this.appConfig.app, pageConfig);
    const { navigationBarTextStyle } = mergeConfig;
    this.updateActionColorStyle(navigationBarTextStyle);
  }

  showLaunchScreen() {
    const launchScreen = this.el.querySelector('.wx-mini-app__launch-screen');
    const name = this.el.querySelector('.wx-mini-app__name');
    const logo = this.el.querySelector('.wx-mini-app__logo-img-url');

    this.updateActionColorStyle('black');
    name.innerHTML = this.appInfo.appName;
    logo.src = this.appInfo.logo;
    launchScreen.style.display = 'block';
  }

  hiddenLaunchScreen() {
    const startPage = this.el.querySelector('.wx-mini-app__launch-screen');

    startPage.style.display = 'none';
  }

  updateActionColorStyle(color) {
    const action = this.el.querySelector('.wx-mini-app-navigation__actions');

    if (color === 'white') {
      action.classList.remove('wx-mini-app-navigation__actions--black');
      action.classList.add('wx-mini-app-navigation__actions--white');
    }

    if (color === 'black') {
      action.classList.remove('wx-mini-app-navigation__actions--white');
      action.classList.add('wx-mini-app-navigation__actions--black');
    }

    this.parent.updateStatusBarColor(color);
  }

  // 小程序内部打开页面
  async openPage(opts) {
    if (!this.webviewAnimaEnd) {
      return;
    }
    this.webviewAnimaEnd = false;

    const { pagePath, query } = opts;

    this.updateTargetPageColorStyle(pagePath);

    const pageConfig = this.appConfig.modules[pagePath];
    const bridge = await this.createBridge({
      pagePath,
      query,
      isRoot: false,
      jscore: this.jscore,
      appId: this.appInfo.appId,
      scene: this.appInfo.scene,
      pages: this.appConfig.app.pages,
      configInfo: mergePageConfig(this.appConfig.app, pageConfig),
    });
    const preBridge = this.bridgeList[this.bridgeList.length - 1];
    const preWebview = preBridge.webView;

    this.bridgeList.push(bridge);
    this.bridges[bridge.id] = bridge;
    bridge.startWithoutLogic();

    // 上一个视图向左动画推出
    preWebview.el.classList.remove('wx-native-view--instage');
    preWebview.el.classList.add('wx-native-view--slide-out');
    preWebview.el.classList.add('wx-native-view--linear-anima');
    preBridge.pageHide && preBridge.pageHide();
    bridge.webView.el.style.zIndex = this.bridgeList.length + 1;
    // 当前视图向左动画推入
    bridge.webView.el.classList.add('wx-native-view--enter-anima');
    bridge.webView.el.classList.add('wx-native-view--instage');

    await sleep(540);
    this.webviewAnimaEnd = true;
    preWebview.el.classList.remove('wx-native-view--linear-anima');
    bridge.webView.el.classList.remove('wx-native-view--before-enter');
    bridge.webView.el.classList.remove('wx-native-view--enter-anima');
    bridge.webView.el.classList.remove('wx-native-view--instage');
  }

  // 小程序内部页面退出
  async exitPage() {
    if (this.bridgeList.length < 2) {
      return;
    }

    if (!this.webviewAnimaEnd) {
      return;
    }

    this.webviewAnimaEnd = false;

    const currentBridge = this.bridgeList.pop();
    const preBridge = this.bridgeList[this.bridgeList.length - 1];

    this.updateTargetPageColorStyle(preBridge.opts.pagePath);
    currentBridge.webView.el.classList.add('wx-native-view--before-enter');
    currentBridge.webView.el.classList.add('wx-native-view--enter-anima');
    currentBridge.destroy && currentBridge.destroy();
    preBridge.webView.el.classList.remove('wx-native-view--slide-out');
    preBridge.webView.el.classList.add('wx-native-view--instage');
    preBridge.webView.el.classList.add('wx-native-view--enter-anima');
    preBridge.pageShow && preBridge.pageShow();
    await sleep(540);
    this.webviewAnimaEnd = true;
    preBridge.webView.el.classList.remove('wx-native-view--enter-anima');
    preBridge.webView.el.classList.remove('wx-native-view--instage');
    currentBridge.webView.el.parentNode.removeChild(currentBridge.webView.el);
  }
}
