// 这里是用来init watch computed data 等等的初始化

import observe from './observe'
import proxyData from './proxy'
function initState(vm) {
  var options = vm.$options
  if(options.data) {
    initData(vm)
  }
  // ...
  // 还有其他init initComputed initWatch
}

function initData(vm) {
  var data = vm.$options.data

  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}


  for(var key in data) {
    // vm的代理，vm.title => vm._data.title
    proxyData(vm, '_data', key)
  }

  // data的响应式
  observe(vm._data)
}

export {
  initState
}