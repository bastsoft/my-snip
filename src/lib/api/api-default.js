  let currentEl = null;

  const getDefaultApi = function (logger){
    return {
    initEl: async el => {
      logger.log("initEl");
      currentEl = [el];
    },
    then: (resolve) => resolve(currentEl),

    log: async message => {
      logger.log(message);
    },
    wait: async (time) => await new Promise((resolve) => setTimeout(resolve, time)),
    get: (selector) => {
      return new Promise((resolve, reject) => {
        let ms = 3000;
        let waited = 0;
        let startTime = Date.now();
        let timeOutId = null;
        logger.log("get wait: ", selector);
    
        (function waitElem(){
          timeOutId = setTimeout(() => {
            let elArr = [...currentEl[0].querySelectorAll(selector)];
            const isFind = (elArr.length > 0);
            if (waited >= ms || isFind) {
              clearTimeout(timeOutId);
              if(isFind){
                  logger.log("get found: ", selector);
                  currentEl = elArr;
                  resolve();
              }else{
                  reject();
              }
            } else {
              waited = Date.now() - startTime;
              waitElem();
            }
          }, 0);
        })();
      });
    },
    contains: (selector, content) => {
      return new Promise((resolve, reject) => {
        let ms = 3000;
        let waited = 0;
        let startTime = Date.now();
        let timeOutId = null;
        logger.log("contains wait: ", selector, content);
    
        (function waitElem(){
          timeOutId = setTimeout(() => {
            let elArr = [...currentEl[0].querySelectorAll(selector)].filter(el => {
              const elText = (el.innerText || "").toLowerCase();
              const text = (content || "").toLowerCase();
              return elText.indexOf(text) > -1; 
            });
            const isFind = (elArr.length > 0);
            if (waited >= ms || isFind) {
              clearTimeout(timeOutId);
              if(isFind){
                  logger.log("contains found: ", selector, content);
                  currentEl = elArr;
                  resolve();
              }else{
                  reject();
              }
            } else {
              waited = Date.now() - startTime;
              waitElem();
            }
          }, 0);
        })();
      });
    },
    find: async (selector) => {
      const el = [...currentEl[0].querySelectorAll(selector)];
      if (el.length > 0) {
        currentEl = el;
      }
    },
    type: async (text) => {
      const value = text.replace(/{backspace}|{del}|{downArrow}|{end}|{enter}|{esc}|{home}|{insert}|{leftArrow}|{moveToEnd}|{moveToStart}|{pageDown}|{pageUp}|{rightArrow}|{selectAll}|{upArrow}|{alt}|{ctrl}|{meta}|{shift}]/g,"");
      currentEl[0].value = value;
      currentEl[0].dispatchEvent(new CustomEvent("input", {
        bubbles: true
      }));
    },
    click: async () => {
      const { left: clientX, bottom: clientY } = currentEl[0].getBoundingClientRect();
      let evt = new MouseEvent("click", {
        button: 0,
        bubbles: true,
        cancelable: true,
        clientX,
        clientY
      });
      currentEl[0].dispatchEvent(evt);
    },
    rightclick: async () => {
      const { left: clientX, bottom: clientY } = currentEl[0].getBoundingClientRect();
      let evt = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: false,
        button: 2,
        buttons: 0,
        clientX,
        clientY
      });
      currentEl[0].dispatchEvent(evt);
    },
    trigger: async eventName => {
      const evt = new Event(eventName);
      currentEl[0].dispatchEvent(evt);
    },  
    focus: async () => {
      currentEl[0].dispatchEvent(new CustomEvent("focus", { bubbles: true }));
    },
    focused: async () => {
      currentEl = [document.activeElement];
    },
    parent: async () => {
      currentEl = [currentEl[0].parentElement];
    },
    last: async () => {
      currentEl = [currentEl[currentEl.length - 1]];
    },
    siblings: async selector => {
      currentEl = [currentEl[0].parentElement];
      currentEl = [...currentEl[0].querySelectorAll(selector)];
    },
    eq: async index => {
      currentEl = currentEl.slice(index, index + 1);
    }
  };
};

  export default getDefaultApi;