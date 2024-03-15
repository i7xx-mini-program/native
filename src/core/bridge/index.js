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

  createApp() {
    if (this.status !== 2) {
      return;
    }
    this.status = 0;
    console.log('createApp');
  }
}
