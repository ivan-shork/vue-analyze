// 响应式的代理都在这

import { useReactive } from "./reactive";
import { isEqual, isExistKey, isObject } from "./share/utils";

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    
    console.log('响应式读取', target[key]);
    
    if(isObject(res)) {
      return useReactive(res);
    }

    return res;
  }
}


function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]
    let res = false
    if(!isExistKey(target, key)) {
      res = Reflect.set(target, key, value, receiver)
      // 响应式增加
      console.log('响应式增加', target,key, value);
      
    } else if(!isEqual(oldValue, value)) {
      // 响应式修改
      res = Reflect.set(target, key, value, receiver)
      // update view
      
    }
    return res
  }
}


export const reactHandler = {
  get: createGetter(),
  set: createSetter()
}