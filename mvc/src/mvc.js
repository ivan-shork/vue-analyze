;(function() {
   
  function init() {
    model.init();
    view.render();
    // GUI渲染完后才执行 所以利用宏任务
    setTimeout(()=> {
      controller.init()
    })
  }

  var model = {
    data: {
      a: 1,
      b: 2,
      c: '+',
      r: 3
    },
    // 数据劫持
    init: function() {
      var _this = this
      for(let k in _this.data) {
        (function(key) {
          Object.defineProperty(_this, key, {
            get: function() {
              return _this.data[key]
            },
            set: function(val) {
              _this.data[key] = val 
              view.render(
                {[key]: val}
              )
            }
          })
        })(k)
      }
    }
  }

  var view = {
    el: '#app',
    template: `
      <div class="cal">
        <span class="cal-a">{{ a }}</span>
        <span class="cal-c">{{ c }}</span>
        <span class="cal-b">{{ b }}</span>
        <span>=</span>
        <span class="cal-r">{{ r }}</span>
      </div>
      <div class="operator">
        <input type="text" placeholder="number a" class="cal-input a">
        <input type="text" placeholder="number b" class="cal-input b">
      </div>
      <div class="btn">
        <button>+</button>
        <button>-</button>
        <button>*</button>
        <button>/</button>
      </div>
    `,
    render: function(mutedData) {
      if(!mutedData) {
        this.template = this.template.replace(/\{\{(.*?)\}\}/g,
        function(node, key) {
          key = key.trim()
          return model[key]
        })
        var container = document.createElement('div')
        container.innerHTML = this.template
        document.querySelector(this.el).appendChild(container)
      } else {
        for(let k in mutedData) {
          document.querySelector(`.cal-${k}`).textContent = mutedData[k]
        }
      }
    }
  }
  var controller = {
    // 逻辑层 当事件发生时，实现影响model层数据的逻辑
    init: function() {
      const oInputs = document.querySelectorAll('.cal-input')
      for(let oItem of oInputs) {
        oItem.addEventListener('input', this.handleInput.bind(this), false)        
      }
      this.calculator();
    },
    handleInput: function(e) {
      e = e || window.event
      const target = e.target || e.srcElement
      const value = Number(target.value)
      model[target.classList[1]] = value   
      this.handleOperator()
    },
    handleOperator: function() {
      // 计算结果
      model['r'] = eval('model.a' + model.c + 'model.b')
      
    },
    calculator: function() {
      const btns = document.querySelector('.btn').children
      console.log(btns, 'btns');
      
      [...btns].forEach(btn=> {        
        btn.addEventListener('click', (e)=> {
          model.c = e.target.innerText
          this.handleOperator()
        })
      })
    }
  }

  init();
})();