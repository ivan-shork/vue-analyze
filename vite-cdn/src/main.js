const {createApp} = Vue
createApp({
  data() {
    return {
      text: 'ass'
    }
  },
  template: `
    <div>{{text}}</div>
  `
}).mount('#app')