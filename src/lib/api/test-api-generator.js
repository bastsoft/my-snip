
import Queue from "./commands-queue.js";

export default function(mountElement, api){
  const queue = new Queue();

  for (let [defaultName, func] of Object.entries(api)) {
    queue._add(defaultName, func);
  }

  return new Proxy(queue, {
    get(target, prop) {
      target.initEl(mountElement);
      return target[prop];
    }
  });
}