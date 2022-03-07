import newArrProto from "./array"
import { defineReactive } from "./reactive"


function initState(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  
  proxyData(vm, '_data')

  observe(vm._data)
}


function proxyData (vm, target) {
  const data = vm[target]
  for(let k in data) {
    if(data.hasOwnProperty(k)) {
      Object.defineProperty(vm, k, {
        get() {
          return vm[target][k]
        },
        set (val) {
          vm[target][k] = val
        }
      })
    }
  }
}

function observe(target) {
  if(typeof target!== 'object' || target === null) return
  new Observer(target)
}


class Observer {
  constructor(target) {
    if(Array.isArray(target)) {
      target.__proto__ = newArrProto
      observeArray(target)
    } else {
      this.walk(target)
    }

  }

  walk(target) {
    for(let k in target) {
      defineReactive(target, k, target[k])
    }
  }
}

export {
  observe,
  initState
}

