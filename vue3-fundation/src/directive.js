/**
 * 
 * 模仿指令系统
 * 
 * 思路： 
 * 1. 响应式劫持数据
 * 2. 声明showPool 
 *    Map 
 *      key: data中的属性名
 *      dom: 对应的dom节点
 * 3. 解析methods 给dom节点绑定对应的事件， 解析参数 
 * 4. methods调用时会改变data，触发响应式的setter，setter中去将showPool对应的dom找出来
 * 5. 初始化render
 * 6. update view 
 */


  var Vue = (function() {
    
    function Vue(vmOpts) {
      const {beforeCreate, created, beforeMount, mounted} = vmOpts
      const recycles = {
        beforeCreate: beforeCreate.bind(this),
        created: created.bind(this),
        beforeMount: beforeMount.bind(this),
        mounted: mounted.bind(this)
      }

      recycles.beforeCreate()
      vmOpts.data = vmOpts.data();
      Object.defineProperty(this, '$data', {
        writable: true,
        value: vmOpts.data,
        enumerable: false,
        configurable: false
      })
      this._init(vmOpts, recycles)
    }
    Vue.prototype._init = function({ el, data, template, methods }, recycles) {

      recycles.created();
      
      const container =  document.createElement('div');
      container.innerHTML = template;
      
      
      const eventPool = new Map()
      const showPool = new Map()
      const vm = this
      vm.el = el
      
      initData(data, vm, showPool)

      initPool(container, methods, showPool, eventPool)
      bindEvent(eventPool, vm)
      render(vm, container, showPool, recycles)

      
    }

    function initPool(container, methods, showPool, eventPool) {
      /**
       * [
       *  'data',
       * {
       *  dom,
       *  type: ''
       * }
       * ]
       */
      const allNodes = container.querySelectorAll('*');
      [...allNodes].forEach(node=> {
        var vIfProp = node.getAttribute('v-if') || '',
            vShowProp = node.getAttribute('v-show') || '',
            vBindMethod = node.getAttribute('@click') || ''; 
        if(vIfProp) {
          showPool.set(
            vIfProp,
            {
              node,
              type: 'if'
            }
          )
          node.removeAttribute('v-if')
        } else if (vShowProp) {
          showPool.set(
            vIfProp,
            {
              node,
              type: 'show'
            }
          )
          node.removeAttribute('v-show')
        }

        if(vBindMethod) {
          const method_reg = /(\w+)(\((.*)\))?/
          const matched = vBindMethod.match(method_reg)
          const methodName = matched[1]
          const params = matched[matched.length - 1].split(',').map(item=> item.trim()).map(item=> {            
            if(!item.includes(`'`)) {
              if(item == 'true') {
                return true
              } else if(item == 'false') {
                return false
              }
              return Number(item)
            }            
            return item.slice(1, -1)
          })
          
          eventPool.set(
            node, 
            {
              handler: methods[methodName],
              params
            }
          )          
        }
      })
      
    }

    function bindEvent(eventPool, vm) {
      for(let [node, method] of eventPool) {
        vm[method.handler.name] = method.handler
        node.addEventListener('click', ()=> {
          method.handler.apply(vm, method.handler.params)
        }, false)
      }
    }

    function render(vm, container, showPool, recycles) {
      for(let [key, vData] of showPool) {
        const {node, type} = vData
        switch (type) {
          case 'if':
            vData.comment = document.createComment('---- v-if ----')
            !vm[key] && node.parentNode.replaceChild(vData.comment, node)
            break;
            default:
              break;
            }
          }
      recycles.beforeMount()
      document.querySelector(vm.el).appendChild(container)
      recycles.mounted()
    }

    function initData($data, vm, showPool) {
      // 响应式劫持
      var _this = vm
      for(var key in $data) {
        (function(k){
          Object.defineProperty(_this, k, {
            get() {
              return _this.$data[k]
            },
            set(value) {
              const oldVal = this.$data[k];
              if(value !== oldVal) {
                console.log('设置数据， 触发setter', key, value);
                this.$data[k] = value
                // 更新视图
                updateView(vm, key, value, showPool)
              }
            },
            enumerable: true
          })
        })(key)
      }
    }

    function updateView(vm, key, value, showPool) {
      
      const app = document.querySelector(vm['el']).children[0];
      
      // ... 前面还有很多视图更新的回调
      handleDirective(key, value, showPool)    
    }

    function handleDirective(key, value, showPool) {
      const vData = showPool.get(key)
      const {node, type} = vData
      
      switch(type) {
        case 'if':
          if(!vData.comment) {
            vData.comment = document.createComment('---- v-if ----')
          }
          (!value && node.parentNode.replaceChild(vData.comment, node))
            || vData.comment.parentNode.replaceChild(vData.node, vData.comment)
          break;
        case 'show':
          node.style.display = 'none'
          break;
      }
    }

    Vue.prototype.initMethods = function(methods) {
      for(let key in methods) {
        this[key] = methods[key]
      }
    }

    Vue.prototype.mount = function(el) {
      const container = document.querySelector(el);
      if(!container) {
        throw new Error('not exist this container')
      }
      // container.innerHTML = 
      return this
    }

    return Vue;
  })();




  var vm = new Vue({
    el: '#app',
    methods: {
      changeShow() {
        console.log(this.isShow, '测试');
        this.isShow = !this.isShow
      }
    },
    beforeCreate() {
      console.log('beforeCreate');
    },
    created() {
      // this.isShow = true
      console.log('created');
      
    },
    beforeMount() {
      console.log('beforeMount');
      
    },
    mounted() {
      this.isShow = true
      console.log('mounted');
      
    },
    template: `
      <div class="container">
        <span v-if="isShow">哈哈哈</span>
        <button @click="changeShow('1', 2, 3, true)">change</button>
      </div>   
    `,
    data() {
      return {
        isShow: false
      }
    }
  }).mount("#app")

  



  
  