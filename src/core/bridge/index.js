import { uuid } from '@native/utils/util';
import { WebView } from '@native/core/webview/webview';

export class Bridge {
  constructor(opts) {
    this.id = `bridge_${uuid()}`;
    this.opts = opts;
    this.webView = null;
    this.jscore = opts.jscore;
    this.parent = null;
    this.jscore.addEventListener('message', this.jscoreMessageHandle.bind(this));
  }

  jscoreMessageHandle(msg) {}

  UIMessageHandle(msg) {
    console.log('原生层接收到渲染层的消息:', msg);
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
}
