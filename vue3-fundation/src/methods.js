/**
 * Vue在实例化时会将methods直接注入到实例当中，暴露出来
 * 并且自动为methods中的方法绑定当前的实例（为了方便调用属性及其他方法）
 * 保证事件监听时，回调始终指向当前实例
 * 
 * 
 * @click="changeName('name')"
 * 实际上实例内部做了这样一件绑定this指向的事情
 * onclick = ()=> {changeName('name')}
 * || onclick = ()=> {changeName.call(this, 'name')}
 * 
 */


const app = Vue.createApp({
  data() {
    return {
      title: "aaa"
    }
  },
  methods: {
    handleChangeTitle(name) {
      this.title = name
    }
  },
  template: `
   <div ref='sss'>{{title}}</div>
   <button @click="handleChangeTitle('aven')">change</button>
  `
}).mount("#app")


