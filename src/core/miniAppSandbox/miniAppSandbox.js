import './style.scss';
import tpl from './tpl.html';
import { AppManager } from '@native/core/appManager/appManager';

export class MiniAppSandbox {
  constructor(opts) {
    this.appInfo = opts;
    this.parent = null;
    this.el = document.createElement('div');
    this.el.classList.add('wx-native-view');
  }
  viewDidLoad() {
    this.initPageFrame();
    this.showLaunchScreen();
    this.bindCloseEvent();
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

  showLaunchScreen() {
    const launchScreen = this.el.querySelector('.wx-mini-app__launch-screen');
    const name = this.el.querySelector('.wx-mini-app__name');
    const logo = this.el.querySelector('.wx-mini-app__logo-img-url');

    this.updateActionColorStyle('black');
    name.innerHTML = this.appInfo.appName;
    logo.src = this.appInfo.logo;
    launchScreen.style.display = 'block';
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
