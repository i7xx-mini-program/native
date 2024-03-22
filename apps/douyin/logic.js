
       modDefine('pages/home/index', function(require, exports, module) {
          Page({
  data: {
    text: '抖音首页'
  },
  onLoad: function (options) {
    // 页面创建时执行
    console.log('抖音首页 page onLoad: ', options);
  },
  onShow: function () {
    // 页面出现在前台时执行
    console.log('抖音首页 page onShow');
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
    console.log('抖音首页 page onReady');
  },
  onHide: function () {
    // 页面从前台变为后台时执行
    console.log('抖音首页 onHide');
  },
  onUnload: function () {
    // 页面销毁时执行
    console.log('抖音首页 onUnload');
  },
  onPageScroll: function (opts) {
    // 页面滚动时执行
    console.log('抖音首页scroll:', opts);
  },
  viewTap: function (opts) {
    wx.navigateTo({
      url: 'pages/detail/index?id=123'
    });
  }
}, {
  path: "pages/home/index"
});
       })
    
       modDefine('pages/detail/index', function(require, exports, module) {
          Page({
  data: {
    text: '详情页'
  },
  onLoad: function (options) {
    // 页面创建时执行
    console.log('详情页 page onLoad: ', options);
  },
  onShow: function () {
    // 页面出现在前台时执行
    console.log('详情页 page onShow');
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
    console.log('详情页 page onReady');
  },
  onHide: function () {
    // 页面从前台变为后台时执行
  },
  onUnload: function () {
    // 页面销毁时执行
  },
  onPageScroll: function (opts) {
    // 页面滚动时执行
    console.log(opts);
  }
}, {
  path: "pages/detail/index"
});
       })
    
       modDefine('app', function(require, exports, module) {
          App({
  onLaunch(options) {
    console.log('抖音 onLaunch: ', options);
  },
  onShow(options) {
    console.log('抖音 onShow: ', options);
  },
  onHide() {
    console.log('抖音 onHide');
  },
  globalData: 'I am global data'
});
       })
    