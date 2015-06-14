var utils = require('./utils.js');
var contextMenuPolyfill = require('./contextMenuPolyfill.js');

var contextMenu = function (targetSelector, obj) {
    if (typeof targetSelector === 'object') {
        targetSelector.forEach(function (target) {
            _createMenu(target, obj);
        });
    } else {
        _createMenu(targetSelector, obj);
    }
};

function _createMenu(targetSelector, obj) {
    var menu = _createMenuEl(obj);
    var id = utils.uniqId();
    var targets = document.querySelectorAll(targetSelector);

    menu.setAttribute('type', 'context');
    menu.setAttribute('id', id);

    Array.prototype.forEach.call(targets, function (target) {
        target.setAttribute('contextmenu', id);
        document.body.appendChild(menu);
    });

    contextMenuPolyfill();
}

function _createMenuEl(items) {
    var menu = document.createElement('menu');

    Object.keys(items).forEach(function (key) {
        var item = (items[key].constructor === Object) ? _createPartition : _createMenuItem;

        menu.appendChild(item(key, items[key]));
    });

    return menu;
}

function _createPartition(label, items) {
    var menu = _createMenuEl(items);

    menu.setAttribute('label', label);

    return menu;
}

function _createMenuItem(label, callBack) {
    var menuitem = document.createElement('menuitem');

    menuitem.setAttribute('label', label);

    if (document.addEventListener) {
        menuitem.addEventListener("click", callBack, false);
    } else {
        menuitem.attachEvent("onclick", callBack);
    }

    return menuitem;
}

module.exports = {
    contextMenu: contextMenu
};
