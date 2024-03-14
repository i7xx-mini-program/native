import { uuid } from '@native/utils/util';

export class Bridge {
  constructor(opts) {
    this.id = `bridge_${uuid()}`;
    this.webView = null;
    this.jsCore = null;
    this.parent = null;
  }

  init() {}
}
