import { uuid } from '@native/utils/util';

export class Bridge {
  constructor(opts) {
    this.id = `bridge_${uuid()}`;
    this.webView = null;
    this.jscore = opts.jscore;
    this.parent = null;
    this.jscore.addEventListener('message', this.jscoreMessageHandle.bind(this));
    this.jscore.postMessage({
      type: 'test',
      body: {
        data: 'bridge 发送消息',
      },
    });
  }

  init() {}

  jscoreMessageHandle(msg) {
    console.log('bridge 接收到逻辑线程的消息：', msg);
  }
}
