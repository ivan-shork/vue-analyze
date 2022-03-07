import { complieToRenderFunction } from "./compiler"
import { mountComponent } from "./lifecycle"
import { initState } from "./observer"

// 插件形式开发
function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options
    initState(vm)    
  }

  Vue.prototype.$mount = function(el) {
    // 取template的顺序
    // render -> template -> html里
    var vm = this,
        options = vm.$options,
        template = options.template || ''
    el = document.querySelector(el)
    vm.$el = el

    if(!options.render) {
      if(!template && el) {
        template = el.outerHTML
      }
      // 将模版转换成render函数
      const render = complieToRenderFunction (template)            
      console.log(render);
      
      // 挂载渲染函数
      options.render = render
    }

    mountComponent(vm)
    
  }
}


export {
  initMixin
}