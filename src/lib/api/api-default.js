let currentEl = null;
let defaultCommandTimeout = 4000;

function getEl(selector) {
  let results = [];
  const parent = currentEl[0];

  if (selector.slice(0, 2) === "//") {
    const XPathResult = 7; //ORDERED_NODE_SNAPSHOT_TYPE
    let query = document.evaluate(
      selector,
      parent || document,
      null,
      XPathResult,
      null
    );
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
      results.push(query.snapshotItem(i));
    }
  } else {
    results = [...parent.querySelectorAll(selector)];
  }

  return results;
}

const getDefaultApi = function (logger) {
  const waitElArr = function (methodLog, findElArr, options) {
    let ms = defaultCommandTimeout;

    if ((options || {}).timeout) {
      ms = options.timeout;
    }

    return new Promise((resolve, reject) => {
      let waited = 0;
      let startTime = Date.now();
      let timeOutId = null;
      logger.log("wait " + methodLog);

      (function waitElem() {
        timeOutId = setTimeout(() => {
          let elArr = findElArr();

          const isFind = elArr.length > 0;

          if (waited >= ms || isFind) {
            clearTimeout(timeOutId);
            if (isFind) {
              logger.log("found " + methodLog);
              currentEl = elArr;
              resolve(currentEl);
            } else {
              currentEl = [];
              resolve(currentEl);
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
    // system
    initEl: async (el) => {
      currentEl = [el];
    },
    then: (resolve) => resolve(currentEl),
    // queries
    contains: (selector, content, options) => {
      return waitElArr(
        "contains " + selector + " " + content,
        () =>
          getEl(selector).filter((el) => {
            const elText = (el.innerText || "").toLowerCase();
            const text = (content || "").toLowerCase();
            return elText.indexOf(text) > -1;
          }),
        options
      );
    },
    eq: async (index) => {
      currentEl = currentEl.slice(index, index + 1);
    },
    find: async (selector) => {
      const el = [...currentEl[0].querySelectorAll(selector)];
      if (el.length > 0) {
        currentEl = el;
      }
    },
    focused: async () => {
      currentEl = [document.activeElement];
    },
    get: (selector, options) => {
      return waitElArr("get " + selector, () => getEl(selector), options);
    },
    last: async () => {
      currentEl = [currentEl[currentEl.length - 1]];
    },
    parent: async () => {
      currentEl = [currentEl[0].parentElement];
    },
    siblings: async (selector) => {
      currentEl = [currentEl[0].parentElement];
      currentEl = [...currentEl[0].querySelectorAll(selector)];
    },
    // actions
    click: async () => {
      const { left: clientX, bottom: clientY } =
        currentEl[0].getBoundingClientRect();
      let evt = new MouseEvent("click", {
        button: 0,
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      });
      currentEl[0].dispatchEvent(evt);
    },
    rightclick: async () => {
      const { left: clientX, bottom: clientY } =
        currentEl[0].getBoundingClientRect();
      let evt = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: false,
        button: 2,
        buttons: 0,
        clientX,
        clientY,
      });
      currentEl[0].dispatchEvent(evt);
    },
    select: async (valueOrTextorIndex) => {
      const selectObj = currentEl[0];
      [...selectObj.options].forEach((option, index) => {
        const isMatchValue = option.value == valueOrTextorIndex;
        const isMatchText = option.text == valueOrTextorIndex;
        const isMatchIndex = index === valueOrTextorIndex;

        if (isMatchValue || isMatchText || isMatchIndex) {
          option.selected = true;
          selectObj.dispatchEvent(
            new CustomEvent("change", {
              bubbles: true,
            })
          );
        }
      });
    },
    trigger: async (eventName) => {
      currentEl[0].dispatchEvent(new Event(eventName));
    },
    type: async (text) => {
      const value = text.replace(
        /{backspace}|{del}|{downArrow}|{end}|{enter}|{esc}|{home}|{insert}|{leftArrow}|{moveToEnd}|{moveToStart}|{pageDown}|{pageUp}|{rightArrow}|{selectAll}|{upArrow}|{alt}|{ctrl}|{meta}|{shift}]/g,
        ""
      );
      currentEl[0].value = value;
      currentEl[0].dispatchEvent(
        new CustomEvent("input", {
          bubbles: true,
        })
      );
    },
    // other commands
    focus: async () => {
      currentEl[0].dispatchEvent(new CustomEvent("focus", { bubbles: true }));
    },
    wait: async (time) =>
      await new Promise((resolve) => setTimeout(resolve, time)),
    log: async (message) => {
      logger.log(message);
    },
  };
};

export default getDefaultApi;
