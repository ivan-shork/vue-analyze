import { createMark } from "./share/utils"
const markId = createMark()
const EVENTS = [
  'click', 'input', 'focus', 'change'
]
export class RenderApp {
  constructor() {
    this.state = {}
    this.template = ''
    this.methods = {},
    this.eventPool = [],
    this.statePool = []
  }

  mount(el) {
    const container = document.querySelector(el)
    if(!container) {
      throw new Error('not exist this container')
    }
    let template = this.template
    template = this.eventFormat(template)
    template = this.stateFormat(template)
    container.innerHTML = template
    // 绑定模版上的事件
    this.eventBinds()
    this.el = container
    return this
  }

  init({state, methods, template}) {
    this.state = state
    this.methods = methods
    this.template = template
    return this
  }

  // 模版处理事件
  eventFormat(template) {
    const eventReg = / on(.*?)\=\"(.*?)\"/g
    let mark = ''
    return template.replace(eventReg, (node, $1, $2)=> {
            
      if(EVENTS.includes($1.toLowerCase())) {
        mark = markId()
        this.eventPool.push({
          mark,
          type: $1.toLowerCase(),
          handler: $2
        })
      }

      return ` ${mark}`
    })
  }
  // 模版处理{{}}
  stateFormat(template) {
    const STATE_REG = /\<(.*?)\>.*?{{(.*?)}}.*?\<\/.*?\>/g
    const addMark = (id, keyArr) => {
      const _state = {}
      _state.mark = id
      _state.state = keyArr
      this.statePool.push(_state)
    }
    template = template.replace(STATE_REG, (node, tag, key)=> {
      let keyIndex = 0;
      let keyArr = [];
      let keyContent = this.state;
      key = key.trim();
      keyArr = key.split('.');
      
      while(keyIndex < keyArr.length) {
        keyContent = keyContent[keyArr[keyIndex++]]
      }
      if(!tag.includes('data-v')) {
        const id = markId()
        tag = tag += `data-v-${id}`
        addMark(id, keyArr)
      } else {
        const id = tag.match(/data-v-\d+/)[0]
        addMark(id, keyArr)
      }
      return `<${tag}>${keyContent}</${tag}>`
    })
    
    console.log(this.statePool);
    
    return template
  }


  // 绑定事件 
  eventBinds() {
    const methodsName = Object.keys(this.methods)
    const eles = document.querySelectorAll('*')
    this.eventPool.forEach(({mark, type, handler})=> {
      const [_, methodName, paramStr] = handler.match(/(.*?)\((.*?)\)/)
      
      if(methodsName.includes(methodName)) {
        const method = this.methods[methodName]
        const params = paramStr.split(',').map(item=> {
          item = item.trim()
          if(!item.includes("'") && !item.includes('"')) {            
            item = Number(item)
          } else {
            item = item.replace(/['|"]/g, '')
          }
          return item
        })
        
        eles.forEach(ele => {
          if(ele.hasAttribute(mark)) {
            ele.addEventListener(type, ()=> {
              method.apply(this, params)
            })
          }
        })
      }
    })  
  }

}

export function createApp(appOpts) {
  const app = new RenderApp()
  return app.init(appOpts)
}