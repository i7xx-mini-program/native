
    modDefine('pages/home/index', function() {
      var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("ui-view", { staticClass: "home", attrs: { bindtap: "viewTap" } }, [
    _vm._v(_vm._s(_vm.text)),
  ])
}
var staticRenderFns = []
render._withStripped = true

      Page({
        path: 'pages/home/index',
        render: render,
        usingComponents: {},
        scopeId: 'data-v-I7kFFEpx5b'
      });
    })
  
    modDefine('pages/detail/index', function() {
      var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("ui-view", { staticClass: "detail" }, [_vm._v(_vm._s(_vm.text))])
}
var staticRenderFns = []
render._withStripped = true

      Page({
        path: 'pages/detail/index',
        render: render,
        usingComponents: {},
        scopeId: 'data-v-nUaJ2TNKKT'
      });
    })
  