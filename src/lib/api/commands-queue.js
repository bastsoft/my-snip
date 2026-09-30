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
      },
      _addPromise(name, promiseFunction) {
          this[name] = (...args) => {
            return new Promise((resolve, reject) => {
              that.runThroughQueue(async () => {
                try {
                  const result = await promiseFunction.bind(that, ...args)();
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              });
            });
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
      let result = null;

      try {
        result = curFunction();
      } catch (error) {
        // ошибка команды не должна навсегда останавливать очередь
        console.error(error);
      }

      (result || (async ()=>{})()).then(() => {
        this.isRunAsynch = false;
        this.runAsynch();
      }, (error) => {
        console.error(error);
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
        let result = null;

        try {
          result = curFunction();
        } catch (error) {
          // ошибка команды (например, клик по ненайденному элементу)
          // не должна навсегда останавливать очередь
          console.error(error);
          alert(String(error));
        }

        if((result || {}).then){
          result.then(() => {
            this.isAsynch = false;
            this.isRun = false;
            this.run();
          }, (error) => {
            console.error(error);
            alert(String(error));
            this.isAsynch = false;
            this.isRun = false;
            this.run();
          });
        } else if (this.isRun) {
          this.isAsynch = false;
          this.isRun = false;
          this.run();
        }
    }
  }
};