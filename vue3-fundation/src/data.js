/**
 * Vue.createApp()
 * 中data必须是一个函数
 * Vue实例在创建的过程中调用data函数，返回一个对象
 * 该对象经过响应式包装后，存储在实例中的$data里
 * 实例可以越过$data直接反问属性（经过proxy代理了）
 */

 const app = Vue.createApp({
   data() {
     return {
       title: "aaa"
     }
   },
   template: `
    <div ref='sss'>{{title}}</div>
   `
 }).mount("#app")


 /**
  * title: 'aaa'
  * $data: ... (这个$data是响应式对象)
  * ...
  * 
  * 
  * 我们访问this.title 实际上就是在反问this.$data.title
  * 
  * tips: data之所以要是一个函数是为了防止不同的实例间有相同的对象引用存在，这样修改某个实例的属性时，会影响到另外一个实例
  */
 