import { queryPath } from '@native/utils/util';
import { getMiniAppInfo } from '@native/services';
import { MiniAppSandbox } from '@native/core/miniAppSandbox/miniAppSandbox';

export class AppManager {
  static appStack = [];
  static async openApp(opts, wx) {
    const { appId, path, scene } = opts;
    const { pagePath, query } = queryPath(path);
    const { appName, logo } = await getMiniAppInfo(appId);

    // 小程序容器实例
    const miniApp = new MiniAppSandbox({
      appId,
      scene,
      logo,
      appName,
      pagePath,
      query,
    });

    AppManager.appStack.push(miniApp);
    wx.presentView(miniApp);
  }

  static async closeApp(miniApp) {
    miniApp.parent.dismissView();
  }
}
