export function isObject(target) {
  return typeof target === 'object' && target !== null
}

export function isExistKey(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

export function isEqual (a, b) {
  return a === b
}

// 唯一标识生成器
export function createMark() {
  let count = 1
  return function randomFn() {
    let ran = Math.random()
    // 生成四位random
    if(ran < 0.1) {
      return randomFn()
    }
    let randomNum = (ran * 10000).toFixed(0)
    return `data-v-${randomNum}${count++}`
  }
}