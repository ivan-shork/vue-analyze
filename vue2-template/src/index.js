import {initMixin} from './init'
import { lifeCycleMixin } from './lifecycle'
import { renderMixin } from './vdom'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)
export default Vue