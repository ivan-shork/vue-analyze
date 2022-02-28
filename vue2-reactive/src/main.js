import Vue from 'vue'

var vm = new Vue({
  data() {
    return {
      a: 1,
      b: 2,
      list: [1, 2, 3],
      person: {
        name: 'aven',
        age: 22,
        info: {
          title: '高级前端工程师'
        }
      }
    }
  }
})

console.log(vm.person.info.title);

console.log(vm.person.name = 22);

vm.list.push({name: 'av'})


