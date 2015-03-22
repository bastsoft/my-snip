var utils = require('./utils.js');
var contextMenuPolyfill = require('./contextMenuPolyfill.js');

var contextMenu = function (targetSelector, obj) {
    var menu = _createMenuEl(obj);
    var id = utils.uniqId();
    var target = document.querySelector(targetSelector);

    menu.setAttribute('type', 'context');
    menu.setAttribute('id', id);
    target.setAttribute('contextmenu', id);
    target.appendChild(menu);
    contextMenuPolyfill();

    return menu;
};

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
    menuitem.addEventListener('click', callBack, false);

    return menuitem;
}

module.exports = {
    contextMenu: contextMenu
};
