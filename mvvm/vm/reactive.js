import { reactHandler } from './reactHandler'
import {isObject} from './share/utils'

// 响应式处理
export function useReactive(target) {
  return createReactObject(target, reactHandler)
}


function createReactObject(target, baseHandler) {
  if(!isObject(target)) {
    return target
  }

  const proxy = new Proxy(target, baseHandler)

  return proxy
}