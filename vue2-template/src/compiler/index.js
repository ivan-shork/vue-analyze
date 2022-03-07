import { parseHtmlToAst } from "./astParser.js";
import { generate } from "./generator.js";

function complieToRenderFunction(html) {
  // 生成抽象语法树
  const ast = parseHtmlToAst(html),
  // 生成渲染函数
  code = generate(ast)
  // with 改变作用域 使其绑定成vm的作用域  
  let render = new Function(`
    with(this) {return ${code}}
  `) 

  return render
}





export {
  complieToRenderFunction
}



