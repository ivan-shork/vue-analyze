// 对vm进行代理
export function reactive(vm, __get__, __set__) {
  // __get__ __set__ 暴露接口给别人，使用回调的方式让他人去获得相关数据
  // ! __set__ 用途很多，此回调可以接入watche和computed
  const $data = vm.$data
  for(var key in $data) {
    (function(k){      
      Object.defineProperty(vm, k, {
        get() {
          __get__(k, $data[k])
          return $data[k]
        },
        set(newVal) {
          const oldVal = $data[k];          
          if(newVal !== oldVal) {
            $data[k] = newVal            
            __set__(k, newVal, oldVal)
          }
        },
        enumerable: true
      })
    })(key)
  }
  // 对data数据进行响应式
  observer($data)
}

// 对定义的data进行深度响应式
function observer(data) {
  if(data===null || typeof data!== 'object') {
    return data
  }
  for(let key in data) {
    defineReactive(data, key, data[key])
  }
}

function defineReactive(obj, key, value) {
  observer(value) 
  Object.defineProperty(obj, key, {       //给obj的key属性添加get/set
    get(){
        // 注意：这里不能返回 obj[key]，会导致死循环（get中取值，又调用get....）
        //      ==>> RangeError: Maximum call stack size exceeded
        return value;
    },
    set(newValue){
        if(value !== newValue){     //如果新值和旧值是一样的，没必要更新
            observer(newValue);     //新值有可能也是一个对象，但如果是常量，会在 observer() 直接被返回
            value = newValue;       //这里也不能使用 obj[key] ==>> 调用get(),不能使用它的返回值去重新赋值
            console.log('视图更新')
        }
    }
})
}