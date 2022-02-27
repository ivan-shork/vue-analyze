/**
 * computedData维护一份computed数据
 * {
 *  key :{
 *    value: 'xxx',
 *    get: fn.bind(vm),
 *    dep: [] // 依赖项
 *  }
 * }
 */

//  computedData的数据其实是不用暴露出去的，是我们用来维护computed依赖的数据
// 所需要暴露的就是update接口，用来给响应式使用

 class Computed {


   constructor() {
    this.computedData = []
   }

   addComputed(vm, computed, key) {
    const descriptor = Object.getOwnPropertyDescriptor(computed, key)
    const get = descriptor.value.get
                ? descriptor.value.get
                : descriptor.value  
                
    // const script = get.toStirng()
    const deps = this.desctructorDep(get)
    const value = get.call(vm)
    const data = {
      get: get.bind(vm),
      deps,
      value
    }
    this.computedData[key] = data
    this.injectComputedToVm(vm, key)        
   }


   injectComputedToVm(vm, key) {
     var _this = this
      Object.defineProperty(vm, key, {
        get() {
          return _this.computedData[key].value
        },
        set(newVal) {
          // _this.computedData[key].value = newVal
          _this.computedData[key].value = _this.computedData[key].get()
        },
        enumerable: true
      })
   }

  //  set的时候依赖变更的时候，重新执行get
   update(key, cb) {
    for(let _key in this.computedData) {
      const data = this.computedData[_key]
      const deps = data.deps
      if(deps.includes(key)) {
        // 包含依赖项
        let oldVal = data.value
        data.value = data.get()
        // ! 用来computed的时候 额外附加操作，比如watch
        cb(_key, data.value, oldVal)
      }
    }
   }

  //  收集computed某个key的依赖
   desctructorDep(script) {
    const reg = /this\.(\w+)/g
    const deps = []    
    let res = null    
    
    while( res = reg.exec(script)) {      
      deps.push(res[1])
    }
    return deps
   }


 }

 export default Computed