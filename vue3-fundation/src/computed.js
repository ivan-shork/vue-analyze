/**
 * computed:
 *  1. 用来解决逻辑复杂运算的结果
 *  2. 用来缓存结果，模版上可复用
 *  3. 有且当计算属性依赖的data发生变化时才会去计算
 */


 var Vue = (function(vmOpts) {

  /**
   * 里面放的是computed集合
   * {
   *  total: {
   *    get: function,
   *    value: value,
   *    dep: [] // 依赖的项 vm里data的值
   *  }
   * }
   */
  var computedData = {};
  var dataPool = new Map();
  function Vue(vmOpts) {
    // 挂载到实例上
     this.$el = document.querySelector(vmOpts.el);
     this.$data = vmOpts.data()
  
     this._init(vmOpts.template, vmOpts.computed)
    
  }


  Vue.prototype._init = function (template, computed) {
    var vm = this
    DataReactive(vm, vm.$data)
    computedDataReactive(vm, computed)

    render(vm, template)
    // compileTemplate(vm, container)
    // render()
  }

  function DataReactive(vm, $data) {
    for(var key in $data) {
      (function(k){
        Object.defineProperty(vm, k, {
          get() {
            return vm.$data[k]
          },
          set(value) {
            const oldVal = this.$data[k];
            if(value !== oldVal) {
              console.log('设置数据， 触发setter', key, value);
              vm.$data[k] = value
              update(vm, k)
              // 更新视图
              updateComputedData(vm, key, function(g) {
                update(vm, g)
              })
            }
          },
          enumerable: true
        })
      })(key)
    }
  }

  function update(vm, key) {        
    let dom = dataPool.get(key)
    if(dom) {
      dom.textContent = vm[key]
    }
  }

  function compileTemplate(vm, container) {
    
    const nodes = container.getElementsByTagName('*')        
    for(let i =0; i<nodes.length;i++) {
      
      let node = nodes[i]
      
      const matched = node.textContent.match(/{{(.*?)}}/)            
      if(matched && matched.length) {
        node.textContent = node.textContent.replace(/{{(.*?)}}/, function(str, key) {
          dataPool.set(key.trim(), node)
          return vm[key.trim()]
        })
      }
    }    
    return container
    
  }


  function updateComputedData(vm, key, update) {
    for(let _key in computedData) {
      let dep = computedData[_key].dep
      let keyIndex = dep.indexOf(key)
      if(keyIndex !== -1) {
        vm[_key] = computedData[_key].get()
        update(_key)
      }
    }
  }
  
  function render(vm, template) {
    var _el = vm.$el
    var container = document.createElement('div')
    container.innerHTML = template

    var _domTree = compileTemplate(vm, container)

    _el.appendChild(_domTree)


  }

  function computedDataReactive(vm, computed) {
    _initComputedData(vm, computed)

    for(let key in computedData) {
      Object.defineProperty(vm, key, {
        get() {
          return computedData[key].value
        },
        set(newValue) {
          computedData[key].value = newValue
        },
        enumerable: true
      })
    }
  }

  function _initComputedData(vm, computed) {
    for(var key in computed) {
      var descriptor = Object.getOwnPropertyDescriptor(computed, key),
          descriptorFn = descriptor.value.get 
                        ? descriptor.value.get
                        : descriptor.value

      computedData[key] = {}    
      computedData[key].value = descriptorFn.call(vm)
      computedData[key].get = descriptorFn.bind(vm)
      // 收集依赖项
      computedData[key].dep = _collectDep(descriptorFn.toString())
    }
    
  }

  function _collectDep(script) {
    var reg = /this\.(.+?)/g
    var matched = script.match(reg)
    var dep = matched.map(item=> {
      return item.split('.')[1]
    })
    return dep
  }

  return Vue
 })();


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
        b: 2
      }
    },
    computed: {
      total() {
        return this.a + this.b
      }
    }
 })

 console.log(vm);

 vm.a = 5
 