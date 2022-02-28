import defineReactive from "./reactive"
import newArrProto from './array'
import observeArray from "./observeArr";
function Observer(data) {
  if(Array.isArray(data)) {
    // 重新给是数组的数据绑定新的原型，这些原型里的某些方法是被处理过了的
    // ! 用来对新加入的值进行监测，以此来响应式
    data.__proto__ = newArrProto
    observeArray(data)
  } else {
    this.walk(data)
  }
}

Observer.prototype.walk = function (data) {
  Object.keys(data).forEach(key => {
    let value = data[key]
    defineReactive(data, key, value)
  })
}

export default Observer