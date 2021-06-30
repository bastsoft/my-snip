
export default class Queue {
    constructor(propertyName) {   
      const that = this;
      this._queue = [];
      this.isRun = false;
      
      const main = {
        Commands: {
          add(name, promiseFunction) {
              main[propertyName][name] = (...args) => {
                that.runThroughQueue(promiseFunction.bind(that, ...args));
                
                return main[propertyName];
              };
          }
        },
      };
      
      main[propertyName] = {};  
       
      return main;
    }
    
    runThroughQueue(payload) {
      this._queue.push(payload);
      this.run();
    }
    
    run() {
      if (this._queue.length && !this.isRun) {
          this.isRun = true;
        
          this._queue.shift()().then(() => {
            this.isRun = false;
            this.run();
          });
      }
    }
  };
  