let currentEl = null;
let lastFindElArr = () => [];
// индексное сужение цепочки после get/contains: {index} для first/last/eq,
// null — сужения не было (базовый запрос)
let lastIndexOp = null;
let defaultCommandTimeout = 4000;

function getEl(selector) {
  let results = [];
  // currentEl может быть пустым (предыдущий find не нашёл элемент,
  // но waitFor продолжит поиск) — фолбэк на document, чтобы повторный
  // запрос не падал с TypeError
  const parent = (currentEl && currentEl[0]) || document;

  if (typeof selector !== "string") {
    return results;
  }

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

function isElVisible(el) {
  if (!el || el.nodeType !== 1) {
    return false;
  }

  // элемент скрыт, если сам или любой из предков display:none /
  // visibility:hidden (display не наследуется — rect в реальном
  // браузере был бы нулевым, но проверка предков надёжнее)
  let node = el;

  while (node && node.nodeType === 1) {
    const style = window.getComputedStyle(node);

    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    node = node.parentElement;
  }

  const rect = el.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0;
}

function getElText(el) {
  // в реальном браузере innerText всегда определён;
  // в jsdom (storybook-тесты) его нет — фолбэк на textContent
  if (typeof el.innerText !== "undefined") {
    return el.innerText;
  }

  return el.textContent || "";
}

const getDefaultApi = function (logger) {
  const waitElArr = function (methodLog, findElArr, options) {
    lastFindElArr = findElArr;
    lastIndexOp = null;
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
            const elText = getElText(el).toLowerCase();
            const text = (content || "").toLowerCase();
            return elText.indexOf(text) > -1;
          }),
        options
      );
    },
    eq: async (index) => {
      lastIndexOp = { index };
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
      lastIndexOp = { index: -1 };
      currentEl = [currentEl[currentEl.length - 1]];
    },
    first: async () => {
      lastIndexOp = { index: 0 };
      currentEl = currentEl.slice(0, 1);
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
      const evtOptions = {
        button: 0,
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      };

      // реальный клик — это mousedown → mouseup → click: часть UI
      // (например, саджесты адреса) слушает именно mousedown
      currentEl[0].dispatchEvent(new MouseEvent("mousedown", evtOptions));
      currentEl[0].dispatchEvent(new MouseEvent("mouseup", evtOptions));
      currentEl[0].dispatchEvent(new MouseEvent("click", evtOptions));
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
      let event = new Event(eventName);

      if(eventName.indexOf("key") === 0){
        event = new KeyboardEvent(eventName, {bubbles: true});
      }

      if(eventName.indexOf("mouse") === 0){
        event = new MouseEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("touch") === 0){
        event = new TouchEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("pointer") === 0){
        event = new PointerEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("wheel") === 0){
        event = new WheelEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("drag") === 0){
        event = new DragEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("clipboard") === 0){
        event = new ClipboardEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("composition") === 0){
        event = new CompositionEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("input") === 0){
        event = new InputEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("animation") === 0){
        event = new AnimationEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("transition") === 0){
        event = new TransitionEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("message") === 0){
        event = new MessageEvent(eventName, {bubbles: true});
      }

      if (eventName.indexOf("storage") === 0){
        event = new StorageEvent(eventName, {bubbles: true});
      }

      currentEl[0].dispatchEvent(event);
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
    // locator.waitFor({ state, timeout }) — ждём элемент последнего locator/get.
    // Важно: элемент уже спозиционирован цепочкой (first/last/eq) — его и ждём,
    // чтобы последующие команды цепочки (click/fill) работали с ним же.
    waitCurrent: (options) => {
      const opts = options || {};
      const state = opts.state || "visible";
      const ms = opts.timeout || defaultCommandTimeout;
      const prevEl = (currentEl && currentEl[0]) || null;

      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        (function waitCurrentEl() {
          let isDone = false;

          if (state === "hidden") {
            // ждём, пока спозиционированный элемент исчезнет или спрячется
            isDone = !prevEl || !isElVisible(prevEl);

            if (isDone) {
              currentEl = [];
            }
          } else if (state === "detached") {
            isDone = !prevEl || !prevEl.isConnected;

            if (isDone) {
              currentEl = [];
            }
          } else {
            // visible (по умолчанию) / attached
            let candidate = null;

            if (prevEl && prevEl.isConnected) {
              candidate = prevEl;
            } else {
              // элемент ещё не найден (или устарел после ререндера) —
              // повторяем запрос по селектору и применяем то же сужение цепочки
              const elArr = lastFindElArr();

              if (lastIndexOp) {
                const index =
                  lastIndexOp.index < 0
                    ? elArr.length + lastIndexOp.index
                    : lastIndexOp.index;

                candidate = index >= 0 && index < elArr.length ? elArr[index] : null;
              } else {
                candidate = elArr[0] || null;
              }
            }

            if (state === "attached") {
              isDone = !!candidate;
            } else {
              isDone = !!candidate && isElVisible(candidate);
            }

            if (isDone) {
              currentEl = [candidate];
            }
          }

          if (isDone) {
            logger.log("found waitFor " + state);
            resolve(currentEl);
          } else if (Date.now() - startTime >= ms) {
            const message =
              "waitFor: элемент не найден за " +
              ms +
              "мс (state: " +
              state +
              ")";
            logger.log(message);
            alert(message);
            reject(new Error(message));
          } else {
            setTimeout(waitCurrentEl, 50);
          }
        })();
      });
    },
    log: async (message) => {
      logger.log(message);
    },
    innerText: async () => {
      const el = currentEl && currentEl[0];

      return (el && getElText(el)) || "";
    },
    evaluate: async (fn, arg) => {
      return await fn(arg);
    },
  };
};

export default getDefaultApi;
