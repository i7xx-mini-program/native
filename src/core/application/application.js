import './application.scss';
import { uuid, sleep } from '@native/utils/util';

export class Application {
  constructor() {
    this.el = null;
    this.window = null;
    this.views = [];
    this.rootView = null;
    this.parent = null;
    this.done = true;
    this.init();
  }

  init() {
    this.el = document.createElement('div');
    this.el.classList.add('wx-application');
    this.window = document.createElement('div');
    this.window.classList.add('wx-native-window');
    this.el.appendChild(this.window);
  }

  initRootView(view) {
    this.rootView = view;
    view.parent = this;
    view.el.classList.add('wx-native-view--instage');
    view.el.style.zIndex = 1;
    this.views.push(view);
    this.window.appendChild(view.el);
    view.viewDidLoad && view.viewDidLoad();
  }

  async pushView(view) {
    // 防抖
    if (!this.done) {
      return;
    }
    this.done = false;

    // 在视图栈里找到上一个视图
    const preView = this.views[this.views.length - 1];

    // 当前视图入栈
    view.parent = this;
    this.views.push(view);
    view.el.style.zIndex = this.views.length;
    view.el.classList.add('wx-native-view--before-enter');
    this.window.appendChild(view.el);
    view.viewDidLoad && view.viewDidLoad();
    await sleep(1);

    // 上一个视图向左动画推出
    preView.el.classList.remove('wx-native-view--instage');
    preView.el.classList.add('wx-native-view--slide-out');
    preView.el.classList.add('wx-native-view--linear-anima');

    // 当前视图向左动画推入
    view.el.classList.add('wx-native-view--enter-anima');
    view.el.classList.add('wx-native-view--instage');
    await sleep(540);
    this.done = true;

    // 动画结束之后移出相关class
    preView.el.classList.remove('wx-native-view--linear-anima');
    view.el.classList.remove('wx-native-view--before-enter');
    view.el.classList.remove('wx-native-view--enter-anima');
    view.el.classList.remove('wx-native-view--instage');
  }

  async popView() {
    if (this.views.length < 2) {
      return;
    }

    if (!this.done) {
      return;
    }

    this.done = false;

    const preView = this.views[this.views.length - 2];
    const currentView = this.views[this.views.length - 1];

    preView.el.classList.remove('wx-native-view--slide-out');
    preView.el.classList.add('wx-native-view--instage');
    preView.el.classList.add('wx-native-view--enter-anima');

    currentView.el.classList.remove('wx-native-view--instage');
    currentView.el.classList.add('wx-native-view--before-enter');
    currentView.el.classList.add('wx-native-view--enter-anima');

    await sleep(540);
    this.done = true;
    this.views.pop();
    this.window.removeChild(currentView.el);
    preView.el.classList.remove('wx-native-view--enter-anima');
  }
}
