function makeFlatObject(snippetsObj, ArrMain, preKey) {
  Object.keys(snippetsObj).reduce((acc, key1) => {
    if (typeof snippetsObj[key1] === "object") {
      makeFlatObject(snippetsObj[key1], acc, preKey + key1 + "▷");
    } else {
      acc.push(preKey + key1);
    }

    return acc;
  }, ArrMain);
}

function removeMenuById(id) {
  const elem = document.getElementById(id);

  if (elem) {
    elem.parentNode.removeChild(elem);
  }
}

const elemId = "inquirer-ui-menu";

export default function (snippets, context) {
  const choices = [];

  makeFlatObject(snippets, choices, "");

  const listObj = { name: "keyname", choices };

  removeMenuById(elemId);

  const topMenu = document.createElement("ul");
  document.body.appendChild(topMenu);

  const _answers = {};
  function _resolveCallback(answ) {
    const arr = answ.keyname.split("▷");
    let lastThis = snippets;
    const callback = arr.reduce((acc, item) => {
      const curLavel = acc[item];
      if(typeof(curLavel) === 'function'){
        lastThis = acc;
      }
      return curLavel;
    }, snippets);

    callback.call(lastThis, context);
  }
  topMenu.setAttribute("id", elemId);
  topMenu.setAttribute(
    "style",
    "\
            z-index: 2147483000;\
            position:fixed;\
            list-style-type:none;\
            margin:0;\
            padding: 0;\
            font-family: monospace;\
            font-size: 14px;\
            cursor: pointer;\
            top: 0;\
            left: 0;\
            background: rgba(255, 255, 255, 0.8);\
            border-radius: 16px;\
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\
            backdrop-filter: blur(5px);\
            -webkit-backdrop-filter: blur(5px);\
            border: 1px solid rgba(255, 255, 255, 0.3);\
        "
  );

  let currentLavel = null;
  let menu = topMenu;

  const createNewSubMenu = function (answer) {
    const id = encodeURI(currentLavel).replace(/\%/g, "");

    let CurMenu = document.getElementById(id);

    if (CurMenu) {
      return CurMenu;
    }

    const newItem = document.createElement("li");
    newItem.setAttribute(
      "style",
      "\
              padding: 10px;\
            "
    );
    newItem.innerHTML = currentLavel;

    CurMenu = document.createElement("ul");
    CurMenu.id = id;
    CurMenu.setAttribute(
      "style",
      "\
              display: none;\
            "
    );
    newItem.appendChild(CurMenu);
    menu.appendChild(newItem);

    newItem.onclick = (event) => {
      event.stopPropagation();
      if (CurMenu.dataset.open === "on") {
        CurMenu.setAttribute(
          "style",
          "\
                  display: none;\
                "
        );
        CurMenu.dataset.open = "";
      } else {
        CurMenu.setAttribute(
          "style",
          "\
                display: block;\
              "
        );

        CurMenu.dataset.open = "on";
      }
    };

    return CurMenu;
  };

  const createNewItem = function (itemName, answer) {
    const menuitem = document.createElement("li");

    menuitem.innerHTML = itemName;

    menuitem.setAttribute(
      "style",
      "\
            padding: 10px;\
          "
    );
    menuitem.setAttribute(
      "onmouseover",
      'this.style.backgroundColor="rgba(81, 114, 201, 0.42)";'
    );
    menuitem.setAttribute(
      "onmouseout",
      'this.style.backgroundColor="rgba(255, 255, 255, 0.2)";'
    );

    menuitem.addEventListener(
      "click",
      () => {
        removeMenuById(elemId);

        if (_resolveCallback) {
          _answers[listObj.name] = answer;
          _resolveCallback(_answers);
          _resolveCallback = null;
        }
      },
      false
    );

    menu.appendChild(menuitem);
  };

  const recursiveMenu = function (
    topMenuNew,
    answer,
    trueAnswer,
    oldCurrentLavel
  ) {
    const answerKeys = answer.split("▷");

    if (currentLavel !== answerKeys[0]) {
      currentLavel = null;
      menu = topMenuNew;
    }

    if (answerKeys.length > 1 && !currentLavel) {
      currentLavel = answerKeys[0];
      menu = createNewSubMenu(answer);
    }

    const itemName = answer.replace(currentLavel + "▷", "");

    if (itemName.includes("▷")) {
      currentLavel = recursiveMenu(menu, itemName, trueAnswer, currentLavel);
    } else {
      createNewItem(itemName, trueAnswer);
    }

    return oldCurrentLavel;
  };

  listObj.choices.forEach((answer) => {
    recursiveMenu(topMenu, answer, answer);
  });
}
