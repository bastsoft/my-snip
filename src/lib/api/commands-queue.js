export default class Queue {
  constructor() {   
    const that = this;
    this._queue = [];
    this.isRun = false;

    this.isAsynch = false;
    this._queueAsynch = [];
    this.isRunAsynch = false;
     
    return {
      _add(name, promiseFunction) {
          this[name] = (...args) => {
            that.runThroughQueue(promiseFunction.bind(that, ...args));
            
            return this;
          };
      }
    };
  }
  
  runThroughQueue(payload) {
    if(!this.isAsynch){
      this._queue.push(payload);
      this.run()
    }else{
      this._queueAsynch.push(payload);
      this.runAsynch()
    }
  }

  runAsynch(){
    if (this._queueAsynch.length && !this.isRunAsynch) {
      this.isRunAsynch = true;
      const curFunction = this._queueAsynch.shift();
      
      (curFunction() || (async ()=>{})()).then(() => {
        this.isRunAsynch = false;
        this.runAsynch();
      });
    }
  }
  
  run() {
    if (this._queue.length && !this.isRun) {
        const curFunction = this._queue.shift();
        this.isRun = true;
        this.isAsynch = curFunction.name === "bound then";
        const result = curFunction();
        
        if((result || {}).then){
          result.then(() => {
            this.isAsynch = false;
            this.isRun = false;
            this.run();
          });
        }
    }
  }
};