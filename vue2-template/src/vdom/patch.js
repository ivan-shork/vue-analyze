/**
 * 
 * @param {*} oldNode 真实的节点 dom中已有的
 * @param {*} vNode  虚拟节点 render函数生成的
 */
function patch(oldNode, vNode) {  
  let el = createEelement(vNode),
      parentElement = oldNode.parentNode;
  
  parentElement.insertBefore(el, oldNode.nextSlibling) 
  parentElement.removeChild(oldNode)
}


function createEelement (vnode) {
  const {tag, props, children, text} = vnode  
  if(typeof tag !== 'undefined') {
    vnode.el = document.createElement(tag);
    updateProps(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createEelement(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  
  return vnode.el;
}

function updateProps (vnode) {
  const el = vnode.el,
        newProps = vnode.props || {}        
  for(let key in newProps) {
    if(key === 'style') {      
      for (let sKey in newProps.style) {
        el.style[sKey] = newProps.style[sKey]
      }
    } else if (key === 'class') {
      el.classList.add(newProps[key])
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}

export {
  patch
}