// array 方法的重写，以便监听新加的值，使其响应式

import {ARR_METHODS} from './conifg'
import observeArray from './observeArr' 
var OriginArrMethods = Array.prototype
var arrMethods = Object.create(OriginArrMethods)

ARR_METHODS.forEach(function(method) {
  arrMethods[method] = function() {
    var args = OriginArrMethods.slice.call(arguments)
    var rt = OriginArrMethods[method].apply(this, args)

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

    return rt
  }
})

export default arrMethods