
    modDefine('pages/home/index', function() {
      var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ui-view",
    { staticClass: "home" },
    [
      _vm.show
        ? _c("ui-view", { staticClass: "text" }, [_vm._v(_vm._s(_vm.text))])
        : _vm._e(),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "hide" } }, [
        _vm._v("隐藏"),
      ]),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "showText" } }, [
        _vm._v("显示"),
      ]),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "goDetail" } }, [
        _vm._v("跳转详情"),
      ]),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "addList" } }, [
        _vm._v("新增列表项"),
      ]),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "changeColor" } }, [
        _vm._v("修改颜色"),
      ]),
      _c("ui-view", { staticClass: "btn", attrs: { bindtap: "openMeiTuan" } }, [
        _vm._v("打开美团小程序"),
      ]),
      _vm._l(_vm.list, function (item, index) {
        return _c(
          "ui-view",
          {
            key: item.key,
            staticClass: "list",
            style: { color: _vm.color, "font-weight": 500 },
          },
          [
            _c("ui-view", { staticClass: "list-item" }, [
              _vm._v(_vm._s(index) + ": " + _vm._s(item.message)),
            ]),
          ],
          1
        )
      }),
      _c("ui-view", { staticClass: "anima-view" }),
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

      Page({
        path: 'pages/home/index',
        render: render,
        usingComponents: {},
        scopeId: 'data-v-g86a90UuSY'
      });
    })
  
    modDefine('pages/detail/index', function() {
      var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ui-view",
    { staticClass: "detail", attrs: { bindtap: "goBack" } },
    [_vm._v(_vm._s(_vm.text))]
  )
}
var staticRenderFns = []
render._withStripped = true

      Page({
        path: 'pages/detail/index',
        render: render,
        usingComponents: {},
        scopeId: 'data-v-0SlQwtctIY'
      });
    })
  