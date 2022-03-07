// !用来挂载vnode的渲染函数，使得实例在更新时可以执行
// !生成虚拟节点

import { createElement, createTextVnode } from "./vnode"

function renderMixin (Vue) {
  // 执行vnode渲染函数 -> 生成vnode
  Vue.prototype._render = function() {
    const vm = this,
          render = vm.$options.render,
          vnode = render.call(vm)
    console.log(vnode);
    
    return vnode
  } 
  // _c _s _v 这三个渲染函数上的方法需要拓展

  Vue.prototype._c = function (...args) {        
    return createElement(...args)
  }
  Vue.prototype._s = function (value) {
    if(value === null) return
    return typeof value === 'object' ? JSON.stringify(value) : value
  }
  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  }
}

export {
  renderMixin
}