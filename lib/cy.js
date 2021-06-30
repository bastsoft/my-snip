export default function(Queue){
    const queue = new Queue("cy");

    queue.Commands.add("log", function(message) {
      return new Promise((resolve, reject) => {
        try {
          console.log(message);
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });
    
    queue.Commands.add("wait", function(time, options) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            resolve();
          }, time);
        }
        catch (err) {
          reject(err);
        }
      });
    });
    
    queue.Commands.add("then", function(callback) {
      return new Promise((resolve, reject) => {
        try {
          callback();
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });
    
    return queue.cy;
}
