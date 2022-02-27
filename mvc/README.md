## vue不用脚手架构建的版本

1. 安装webpack4 webpack webpack-cli webpack-dev-server
2. 新建public src 等文件夹及文件
3. index.html中引入vue的cdn
4. 由于不是vue-cli构建的，因此还要引入能够编译vue文件的库，npm i vue-template-compiler vue-loader
5. 引入html-webpack-plugin
6. 编写webpack.config.js 配置externals
7. vue-loader （vue2） vue-loader@next,@vue/compiler-sfc(vue3) 
