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

    queue.Commands.add("get", function(selector, options) {
      return new Promise((resolve, reject) => {
        try {
          const context = this;
          const el = [...context.el[0].querySelectorAll(selector)];

          if(el.length > 0){
              context.el = el;
              resolve();
          }else{
              reject();
          }
        }catch (err) {
          reject(err);
        }
      });
    });


    queue.Commands.add("type", function(text, options) {
      return new Promise((resolve, reject) => {
        const context = this;
        try {
          context.el[0].value = text;
          context.el[0].dispatchEvent((new CustomEvent("input", {
              bubbles: true
          })));
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("click", function() {
      return new Promise((resolve, reject) => {
        const context = this;
        try {
          var evt = document.createEvent("MouseEvents");

          var clientRect = context.el[0].getBoundingClientRect();
          var clientX = clientRect.left;
          var clientY = clientRect.bottom;

          evt.initMouseEvent("click", true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);

          context.el[0].dispatchEvent(evt);

          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("contains", function(selector, content, options) {
      return new Promise((resolve, reject) => {
        const context = this;

        try {
          context.el = [...context.el[0].querySelectorAll(selector)].filter(el => el.innerText.indexOf(content) !== -1);
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("focus", function(options) {
      return new Promise((resolve, reject) => {
        const context = this;

        try {
          context.el[0].dispatchEvent((new CustomEvent("focus", {
              bubbles: true
          })));
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("focused", function(options) {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = [document.activeElement];
            
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("parent", function() {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = [context.el[0].parentElement];
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("last", function() {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = [context.el[context.el.length - 1]];
          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("siblings", function(selector) {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = [context.el[0].parentElement];
          context.el = [...context.el[0].querySelectorAll(selector)];

          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("eq", function(index) {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = context.el.slice(index, index + 1);

          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("initEl", function(el) {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          context.el = [el];

          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    queue.Commands.add("showEl", function(el) {
      return new Promise((resolve, reject) => {
        const context = this;
        
        try {
          console.log(context.el);

          resolve();
        }
        catch (err) {
          reject(err);
        }
      });
    });

    return queue.cy;
}
