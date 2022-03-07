
const ARR_METHODS = [
  'push',
  'splice',
  'pop',
  'shift',
  'unshift'
]

const originArrProto = Array.prototype
const newArrProto = Object.create(originArrProto)

ARR_METHODS.forEach(method=> {
  newArrProto[method] = function () {
    const args = Array.prototype.slice.call(arguments)
    const res = originArrProto[method].call(this, args)

    var newArr = null
    switch (method) {
      case 'push':
      case 'unshift':
        newArr = args
        break;
      case 'splice':
        newArr = args.slice(2)
        break;
      default:
        break;
    }

    if(newArr) {
      observeArray(newArr)  
    }

    return res
  }
})

export default newArrProto