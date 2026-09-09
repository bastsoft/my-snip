
import Queue from "./commands-queue.js";

const promiseMethods = new Set(["innerText", "evaluate"]);
const directMethods = new Set(["getByText"]);

export default function(mountElement, api){
  const queue = new Queue();

  for (let [defaultName, func] of Object.entries(api)) {
    if(directMethods.has(defaultName)){
      continue;
    }

    if(promiseMethods.has(defaultName)){
      queue._addPromise(defaultName, func);
    } else {
      queue._add(defaultName, func);
    }
  }

  return new Proxy(queue, {
    get(target, prop) {
      target.initEl(mountElement);

      if(directMethods.has(prop)){
        return api[prop];
      }

      return target[prop];
    }
  });
}