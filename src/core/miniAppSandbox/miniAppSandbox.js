import './style.scss';
import tpl from './tpl.html';
import { readFile, mergePageConfig } from './util';
import { AppManager } from '@native/core/appManager/appManager';
import { Bridge } from '@native/core/bridge';

export class MiniAppSandbox {
  constructor(opts) {
    this.appInfo = opts;
    this.parent = null;
    this.appConfig = null;
    this.bridgeList = [];
    this.el = document.createElement('div');
    this.el.classList.add('wx-native-view');
  }
  viewDidLoad() {
    this.initPageFrame();
    this.showLaunchScreen();
    this.bindCloseEvent();
    this.initApp();
  }

  async initApp() {
    //TODO: 没有实现小程序云托管平台 所以使用本地资源
    // 1. 拉去小程序的资源

    // 2. 读取配置文件
    const configPath = `${this.appInfo.appId}/config.json`;
    const configContent = await readFile(configPath);
    this.appConfig = JSON.parse(configContent);
    // 3. 设置状态栏的颜色模式
    const entryPagePath = this.appInfo.pagePath || this.appConfig.app.entryPagePath;
    this.updateTargetPageColorStyle(entryPagePath);
    // 4. 创建通信桥 Bridge
    const entryPageBridge = this.createBridge();
    this.bridgeList.push(entryPageBridge);
    // 5. 触发应用初始化逻辑

    // 6. 隐藏初始化loading动画
    this.hiddenLaunchScreen();
  }

  createBridge() {
    const bridge = new Bridge({});
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

  bindCloseEvent() {
    const closeBtn = this.el.querySelector('.wx-mini-app-navigation__actions-close');

    closeBtn.onclick = () => {
      AppManager.closeApp(this);
    };
  }
}
