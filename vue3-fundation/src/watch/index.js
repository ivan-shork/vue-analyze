// 侦听器watch

/**
 * computed：
 *  关注点在模版，用来抽离复用模版中复杂的逻辑运算
 *  当函数内部的依赖改变后，// !重新调用
 * watch：
 *  关注点在数据更新，当数据更新时，侦听器函数执行，产生额外的副作用。
 *  !常用来数据更新时做一些额外的特殊逻辑
 */

  import { reactive } from './reactive'
  import Computed from './Computed'
  import Watcher from './Watcher'
 class Vue {
   
  constructor(opts) {
    var { data, computed, watch } = opts
    var vm = this

    vm.$data = data()

    this.init(vm, computed, watch)
  }
  
  init(vm, computed, watch) {
    
    this.initData(vm)
    const computedIns =  this.initComputed(vm, computed)
    const watcherIns = this.initWatcher(vm, watch)

    // 获取computed中的update方法，用来给data响应式set的时候用，并且注意这里要bind原来的实例，才能拿到数据！！！！！
    this.$computed = computedIns.update.bind(computedIns);
    this.$watch = watcherIns.notify.bind(watcherIns)
  }

  // 数据响应式
  initData(vm) {
    // ! 此处我们利用 __set__ 接口做一些额外的事情
    // ! computed watch
    reactive(vm, ()=> {}, (key, newVal, oldVal)=> {
      // 当响应式set的时候， computed的逻辑会执行
      this.$computed(key, this.$watch)
      this.$watch(key, newVal, oldVal)
    })
  }

  initComputed(vm, computed) {
    const computedIns = new Computed()
    for(let key in computed) {
      computedIns.addComputed(vm, computed, key)
    }
    return computedIns
  }

  initWatcher(vm, watch) {
    const watcherIns = new Watcher()
    for(let key in watch) {
      watcherIns.addWatcher(vm, watch, key)
    }
    return watcherIns
  }

 }

 export default Vue

 var vm = new Vue({
  el: '#app',
  template: `
    <span>{{a}}</span>
    <span>+</span>
    <span>{{b}}</span>
      <span> = </span>
      <span>{{ total }}</span>
  `,
  data() {
    return {
      a: 1,
      b: 2,
      obj: {
        a: 1
      }
    }
  },
  computed: {
    total() {
      console.log('computed total');
      
      return this.a + this.b
    }
  },
  watch: {
    a(newVal, oldVal) {
      console.log(newVal, oldVal);
    },
    total(val, oldVal) {
      console.log(val, oldVal, 'total'); 
    }
  }
 })

 console.log(vm);

 vm.a = 12

 console.log(vm);


 vm.obj.a = 3
 console.log(vm);
 
 
 