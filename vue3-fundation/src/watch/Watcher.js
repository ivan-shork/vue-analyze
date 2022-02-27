/**
 * 
 * 实际上就是做到
 * addWatcher(vm, watcher, key)
 * this.watchers add new watcher
 * watch 结构
 * {
 *  key: xxx,
 *  fn: fn
 * }
 * 
 */



export default class Watcher {
  constructor() {
    this.watchers = []
  }

  addWatcher(vm, watch, key) {
    const watcher = watch[key]    
    if(!watcher) {
      throw new Error('watch cant not be null')
    }
    const type = typeof watcher
    if(type === 'function') {
      let keyIndex = this.watchers.findIndex(watcher => watcher.key === key)
      const newWatcher = {
        key,
        fn: watcher.bind(vm)
      }
      if(keyIndex !== -1) {
        this.watchers.replace(keyIndex, 1, newWatcher)
      } else {
        this.watchers.push(newWatcher)
      }
    } else if (type === 'object') {
      
    }

  }

  notify(key, newVal, oldVal) {
    if(oldVal === newVal) {
      return 
    }
    const watcher = this.watchers.find(item => item.key === key)
    if(watcher) {
      watcher.fn(newVal, oldVal)
    }
  }

}