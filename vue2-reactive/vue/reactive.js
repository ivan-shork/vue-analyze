import observe from "./observe"

function defineReactive(data, key, value) {
  // value 有可能是个对象 递归观察
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('响应式获取', key);
      
      return value
    },
    set(newVal) {
      console.log('响应式设置', key);
      if(value !== newVal) {
        observe(newVal)
        value = newVal
      }
    }
  })
}

export default defineReactive