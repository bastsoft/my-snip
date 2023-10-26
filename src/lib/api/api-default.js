let currentEl = null;
let defaultCommandTimeout = 4000;

const getDefaultApi = function (logger){
  const waitElArr = function(methodLog, findElArr, options){
    let ms = defaultCommandTimeout;

    if((options || {}).timeout){
      ms = options.timeout;
    }

    return new Promise((resolve, reject) => {
      let waited = 0;
      let startTime = Date.now();
      let timeOutId = null;
      logger.log("wait " + methodLog);

      (function waitElem(){
        timeOutId = setTimeout(() => {
          let elArr = findElArr();

          const isFind = (elArr.length > 0) && elArr[0].getClientRects().length;

          if (waited >= ms || isFind) {
            clearTimeout(timeOutId);
            if(isFind){
                logger.log("found " + methodLog);
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
  };

  return {
    initEl: async el => {
      currentEl = [el];
    },
    then: (resolve) => resolve(currentEl),

    log: async message => {
      logger.log(message);
    },
    wait: async (time) => await new Promise((resolve) => setTimeout(resolve, time)),
    get: (selector, options) => {
      return waitElArr(
        "get " + selector,
        ()=>[...currentEl[0].querySelectorAll(selector)],
        options
      );
    },
    contains: (selector, content, options) => {
      return waitElArr(
        "contains " + selector + " " + content,
        ()=>[...currentEl[0].querySelectorAll(selector)].filter(el => {
          const elText = (el.innerText || "").toLowerCase();
          const text = (content || "").toLowerCase();
          return elText.indexOf(text) > -1; 
        }),
        options
      );
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
      currentEl[0].dispatchEvent(new Event(eventName));
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