import { observe } from "."

function defineReactive(target, key, value) {
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newVal) {
      if(value !== newVal) {
        observe(newVal)
        value = newVal
      }
    }
  })
}

export {
  defineReactive
}