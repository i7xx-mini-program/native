import { uuid } from '@native/utils/util';
import { WebView } from '@native/core/webview/webview';

export class Bridge {
  constructor(opts) {
    this.id = `bridge_${uuid()}`;
    this.opts = opts;
    this.webView = null;
    this.jscore = opts.jscore;
    this.parent = null;
    this.status = 0;
    this.jscore.addEventListener('message', this.jscoreMessageHandle.bind(this));
  }

  jscoreMessageHandle(msg) {
    const { type, body } = msg;
    if (body.bridgeId !== this.id) {
      return;
    }
    switch (type) {
      case 'logicResourceLoaded':
        this.status++;
        this.createApp();
        break;
      case 'appIsCreated':
        this.status++;
        this.notifyMarkInitialData();
        break;
      case 'initialDataIsReady':
        this.status++;
        this.setInitialData(msg);
        break;
    }
  }

  UIMessageHandle(msg) {
    const { type } = msg;

    switch (type) {
      case 'uiResourceLoaded':
        this.status++;
        this.createApp();
        break;
    }
  }

  notifyMarkInitialData() {
    this.jscore.postMessage({
      type: 'markPageInitialData',
      body: {
        bridgeId: this.id,
        pagePath: this.opts.pagePath,
      },
    });
  }

  start() {
    // 通知渲染线程加载资源
    this.webView.postMessage({
      type: 'loadResource',
      body: {
        appId: this.opts.appId,
      },
    });
    // 通知逻辑线程加载资源
    this.jscore.postMessage({
      type: 'loadResource',
      body: {
        appId: this.opts.appId,
        bridgeId: this.id,
      },
    });
  }

  appShow() {
    if (this.status < 2) {
      return;
    }
    this.jscore.postMessage({
      type: 'appShow',
      body: {},
    });
  }

  appHide() {
    if (this.status < 2) {
      return;
    }
    this.jscore.postMessage({
      type: 'appHide',
      body: {},
    });
  }

  async init() {
    this.webView = await this.createWebView();
    this.webView.addEventListener('message', this.UIMessageHandle.bind(this));
  }

  createWebView() {
    return new Promise((resolve) => {
      const webView = new WebView({
        isRoot: this.opts.isRoot,
        configInfo: this.opts.configInfo,
      });
      webView.parent = this;
      webView.init(() => {
        resolve(webView);
      });
      this.parent.webViewContainer.appendChild(webView.el);
    });
  }

  setInitialData(msg) {
    const { initialData } = msg.body;
    this.webView.postMessage({
      type: 'setInitialData',
      body: {
        initialData,
      },
    });
  }

  createApp() {
    if (this.status !== 2) {
      return;
    }
    // 通知逻辑线程
    this.jscore.postMessage({
      type: 'createApp',
      body: {
        bridgeId: this.id,
        scene: this.opts.scene,
        pagePath: this.opts.pagePath,
        query: this.opts.query,
      },
    });
  }
}
