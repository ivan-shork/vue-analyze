/**
 * 应用实例和组件实例
 * 
 *  createApp 创建app -> 返回一个应用实例 （应用实例）
 *  应用实例主要用来创建全局组件
 *  应用实例上会有很多方法： directive、 use、 component、 filter
 *  这些实例方法调用后都会返回一个原先的应用模式（单例模式）
 *  !根组件的本质是一个对象，然后放到createApp里会生成一个应用实例（根组件实例），Vue渲染的起点
 *  */ 
// 
import './mvc.js'
const {createApp, ref} = Vue
const MyApp = {
  name: 'MyApp',
  props: {
    type: String
  },
  setup() {
    const msg = ref('afs')
    return {
      msg
    }
  },
  data() {
    return {
      text: 'aaa'
    }
  },
  methods: {
    countAdd() {
      this.text = 'ddd'
      console.log(this)
    }
  },
  template: `
    <div>
    text: {{ text }}
    <p>
      type: {{type}}
    </p>
    <p>
      msg: {{msg}}
    </p>
    </div>
  `
}
const app = createApp({
  components: {
    MyApp
  },
  mounted() {
  },
  data() {
    return {
      text: 'aaa'
    }
  },
  methods: {
    log(val) {
      console.log(val)
    }
  }
})

app.component('MyTest', {
  el: '#main',
  mounted() {
    console.log(this, this.$parent)
  },
  data() {
    return {
      test: '测试测试'
    }
  },
  template: `
    <div>{{test}}</div>
    <button @click="log(111)">测试</button>
  `,
  methods: {
    log(val) {
      this.$emit('change-log', val)
    }
  }
})

app.mount('#app')

