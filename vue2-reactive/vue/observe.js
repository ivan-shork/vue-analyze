import Observer from "./Observer"

function observe(target) {
  if(typeof target !== 'object' || target === null) return;
  return new Observer(target);
}

export default observe