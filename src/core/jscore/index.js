import mitt from 'mitt';

export class JSCore {
  constructor() {
    this.parent = null;
    this.worker = null;
    this.event = new mitt();
  }

  async init() {
    // wx App Page
    const jsContent = await fetch('http://127.0.0.1:3100/logic/core.js');
    const jsBob = await jsContent.blob();
    const url = window.URL.createObjectURL(jsBob);

    this.worker = new Worker(url);

    this.worker.addEventListener('message', (e) => {
      const msg = e.data;
      this.event.emit('message', msg);
    });
  }

  postMessage(msg) {
    this.worker.postMessage(msg);
  }

  addEventListener(type, handler) {
    this.event.on(type, handler);
  }
}
