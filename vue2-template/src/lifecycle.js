import { patch } from './vdom/patch'

function mountComponent(vm) {
  vm._update(vm._render())
}

function lifeCycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const oldNode = vm.$el
    patch(oldNode, vnode)
  }
}

export {
  lifeCycleMixin,
  mountComponent
}