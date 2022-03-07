/**
 * _c() => createElement()
 * _v() => createTextNode()
 * _s() => {{name}} => _s(name)
 * 
 * <div id="app" style="color: red, font-size: 13px">
 *  hello {{name}}
 *  <span class="text">
 *    {{age}}
 *  </span>
 * </div>
 * 
 * render() {
 *  return `
 *    _c(
 *      'div', 
 *       {
 *        id: "app", 
 *        style: { color: "red", font-size: "13px" }
 *       },
 *       _v("hello "+_s(name)),
 *       _c(
 *          'span',
 *          {
 *            class: 'text', 
 *          },
 *          _v(_s(age))
 *         )
 *      )
 *  `
 * }
 */

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function generate (el) {
  let children = getChildren(el)
  let code = `_c('${el.tag}', ${
        el.attrs.length  
        ? formatProps(el.attrs)
        : 'undefined'},${
          children ? children : ''
        })`
  return code 
}

function getChildren (el) {
  const children = el.children
  if(children) {
    return children.map(c => generateChild(c)).join(',')
  }
}

function generateChild (node) {
  // 可能是元素节点或者是文本节点 分情况
  if(node.type === 1) {
    return generate(node)
  } else if(node.type === 3) {
    let text = node.text
    // 没有有双括号情况
    if(!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    let match, index, 
        lastIndex = defaultTagRE.lastIndex = 0,
        textArr = [];
    while(match = defaultTagRE.exec(text)) {
      index = match.index
      if(index > lastIndex) {
        // 证明前面是纯文本的节点
        // 截取 lastindex 到 index
        textArr.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      textArr.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    // 匹配双括号后 后面还有东西
    if(lastIndex < text.length) {
      textArr.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${textArr.join('+')})`
  }
}

function formatProps (attrs) {
  let attrStr = ''
  for(let attr of attrs) {
    if(attr.name === 'style') {
      // 处理style属性为对象
      let styleAttrs = {}
      attr.value.split(";").forEach(styleAttr => {
        if(styleAttr) {
          let [key, value] = styleAttr.split(":")                  
          styleAttrs[key] = value.trim()
        }        
      })
      attr.value = styleAttrs      
    }
    attrStr += `${attr.name}:${JSON.stringify(attr.value)},`
  }  
  return `{
    ${attrStr.slice(0, -1)}
  }`
}

export {
  generate
}