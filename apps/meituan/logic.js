
       modDefine('pages/home/index', function(require, exports, module) {
          Page({
  data: {
    show: true,
    text: '美团首页',
    list: [{
      key: 1,
      message: '这是第一条消息'
    }, {
      key: 2,
      message: '这是第二条消息'
    }],
    color: 'red'
  },
  onLoad: function (options) {
    // 页面创建时执行
    console.log('美团首页 page onLoad: ', options);
  },
  onShow: function () {
    // 页面出现在前台时执行
    console.log('美团首页 page onShow');
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
    console.log('美团首页 page onReady');
  },
  onHide: function () {
    // 页面从前台变为后台时执行
    console.log('美团首页 onHide');
  },
  onUnload: function () {
    // 页面销毁时执行
    console.log('美团首页 onUnload');
  },
  onPageScroll: function (opts) {
    // 页面滚动时执行
    console.log('美团首页scroll:', opts);
  },
  goDetail: function (opts) {
    wx.navigateTo({
      url: 'pages/detail/index?id=123',
      onSuccess: () => {
        console.log('跳转详情成功');
      }
    });
  },
  hide() {
    this.setData({
      show: false
    });
  },
  showText() {
    this.setData({
      show: true
    });
  },
  addList() {
    this.setData({
      list: [...this.data.list, {
        key: this.data.list.length,
        message: `这是第${this.data.list.length}条消息`
      }]
    });
  },
  changeColor() {
    this.setData({
      color: `#${Math.random().toString(16).substring(2, 8)}`
    });
  },
  openMeiTuan() {
    wx.navigateToMiniProgram({
      appId: 'douyin',
      path: 'pages/home/index?id=123'
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
    console.log('详情页 page onHide');
  },
  onUnload: function () {
    // 页面销毁时执行
    console.log('详情页 page onUnload');
  },
  onPageScroll: function (opts) {
    // 页面滚动时执行
    console.log(opts);
  },
  goBack() {
    wx.navigateBack();
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
    