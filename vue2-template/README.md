vue的template是会先经过编译
然后变成 ast树的
（ast树中里面会包含各种指令啊，双括号符啊，事件啊，vue就是用来解析这些的）
再来才是执行渲染函数生成虚拟dom


虚拟dom是用来描述dom节点的，它是用来patch打补丁，渲染成真实dom的，所以上面不会有非dom节点有的诸如指令啊事件啊等等的

1. 获取 template ✅
2. template -> ast ✅
3. ast -> 渲染函数 -> _c _v _s
4. render函数 -> 执行生成虚拟dom
5. 虚拟dom -> patch -> 真实dom