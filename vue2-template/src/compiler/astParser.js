// 解析html -> ast
/**
 * 
 * @param {*} html 
 * <div id="app" style="color: red;font-size: 20px;">
    <div class="container">
      <h2>{{ title }}</h2>
      <div class="info" style="color: green;">
        <p>姓名： {{ name }}</p>
        <p>年龄： {{ age }}</p>
      </div>
    </div>
  </div>

  每匹配一个 删除一个
 */
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


// 1. 先用正则匹配开始标签、结束标签 
// 2. 中间去match开始标签的节点，取出属性，组成一个对象，然后用start去处理
// 3. 结尾标签也用match去匹配， 然后用end去处理（譬如绑定父子属性）
function parseHtmlToAst(html) {
  let text,
      root,
      currentParent,
      stack = []
  while(html) {
    let textStart = html.indexOf('<')

    if(textStart === 0) {
      // 处理开始标签及属性
      const startTagMatch = parseStartTag()         
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      // 处理结束标签
      const endTagMatch = html.match(endTag)      
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue 
      }
    } else if(textStart > 0) {
      // 证明有文本 xxx< 如果是 < 则刚好index为0，证明是开始标签，是上面的情况
      text = html.substring(0, textStart)
    } 
    // 处理文本
    if(text) {
      advance(text.length)
      chars(text)
    }
  }

  function parseStartTag() {
    // 处理开始标签 然后生成一个新的match

    const start = html.match(startTagOpen)
    // 是否有结尾标签， 是否有属性
    let end, attr;
    if(start) {
      const match = {
        tagName: start[1], 
        attrs: []
      }
      advance(start[0].length)

      while(!(end = html.match(startTagClose))&& (attr = html.match(attribute))) {
        // 没有匹配到结尾标签，并且匹配到属性
        match.attrs.push({
          name: attr[1],
          // 这里是匹配三种情况 id="app" id=app id='app'
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      // 已经到结束了      
      if(end) {
        advance(end[0].length)
        return match
      }

    }
  }

  function advance(n) {
    html = html.substring(n)
  }
  
  // stack [div, p, span]
  // 利用栈 出栈入栈可以判断出谁是谁的父亲
  // example 第一项div入栈，接着第二项p入栈，接着span入栈，start都分析完了，
  // 然后到span的end分析，此时我们对他进行出栈，如果前一项有，那么证明前一项就是它的父亲！
  function start(tagName, attrs) {
    const element = createAstElement(tagName, attrs)
    if(!root) {
      root = element
    }
    // 保存当前项为父亲 父亲为当前分析到的标签
    currentParent = element
    stack.push(element)
  }
  
  function end(tagName) {
    const element = stack.pop()
    // 结束时，父亲改为上一项了
    currentParent = stack[stack.length - 1]
    if(currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  
  function chars(text) {
    // 去掉空格
    text = text.trim()
    if(text && text.length) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  
  function createAstElement(tagName, attrs, parent) {
    return {
      tag: tagName,
      attrs: attrs,
      type: 1,
      children: [],
      parent
    }
  }
  return root
}


export {
  parseHtmlToAst
}