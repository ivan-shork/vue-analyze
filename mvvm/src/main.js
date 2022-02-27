
import {
  useReactive,
  createApp
} from '../vm'

// model view
// m -> useReactive 
// v -> createApp
const myApp = function() {
  const state = useReactive({
    count: 0,
    name: 'aven',
    beg: {
      name: 'a'
    },
    btnName: '+'
  })

  const addNum = function(val) {
    console.log(val, '增加');
    
    
  }

  const delNum = function(val) {
    console.log(val, '减号');
    
    state.count -= val
  }

  const changeName = function(name) {
    console.log(name, 'change');
    
    state.name = name

    console.log(state);
    
  }

  let template = `
    <h1>{{ count }}</h1>
    <h1>{{ name }}</h1>
    <button onClick="addNum(2)"> + </button>
    <button onClick="delNum(2)"> {{ btnName }} </button>
    <button onClick="changeName('aaa')"> changeName </button>
  `

  return {
    state,
    methods: {
      addNum,
      delNum,
      changeName
    },
    template
  }
}


// view
createApp(
  myApp()
).mount('#app')