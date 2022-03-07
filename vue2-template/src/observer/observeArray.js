import { observe } from ".";

export function observeArray(arr) {
  for(let item of arr) {
    observe(item)
  }
}