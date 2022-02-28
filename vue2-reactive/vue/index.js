
import {initState} from './init'

function Vue(vmOpts) {

  this._init(vmOpts)
}

Vue.prototype._init = function(vmOpts) {
  var vm = this
  vm.$options = vmOpts
  // 初始化state， 放在其他模块
  initState(vm)
}

export default Vue