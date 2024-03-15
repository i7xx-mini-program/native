import './style.scss';
import tpl from './tpl.html';
import { readFile, mergePageConfig } from './util';
import { sleep } from '@native/utils/util';
import { AppManager } from '@native/core/appManager/appManager';
import { Bridge } from '@native/core/bridge';
import { JSCore } from '@native/core/jscore';

export class MiniAppSandbox {
  constructor(opts) {
    this.appInfo = opts;
    this.parent = null;
    this.appConfig = null;
    this.bridgeList = [];
    this.jscore = new JSCore();
    this.jscore.parent = this;
    this.webViewContainer = null;

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
    this.jscore.postMessage({
      type: 'test',
      body: {
        message: '小程序容器消息',
      },
    });

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
      configInfo: mergePageConfig(this.appConfig.app, pageConfig),
    });
    this.bridgeList.push(entryPageBridge);
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
    console.log('小程序容器: onPresentIn');
  }

  onPresentOut() {
    console.log('小程序容器: onPresentOut');
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

  jscoreMessageHandler(msg) {
    console.log('小程序容器接收逻辑线程到消息：', msg);
  }

  bindCloseEvent() {
    const closeBtn = this.el.querySelector('.wx-mini-app-navigation__actions-close');

    closeBtn.onclick = () => {
      AppManager.closeApp(this);
    };
  }
}
