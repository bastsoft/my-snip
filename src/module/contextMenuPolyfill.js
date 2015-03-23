var utils = require('./utils.js');

NodeList.prototype.forEach = Array.prototype.forEach;

HTMLElement.prototype.wrap = function (elms) {
    if (!elms.length) {
        elms = [elms];
    }

    for (var i = elms.length - 1; i >= 0; i = i - 1) {
        var child = (i > 0) ? this.cloneNode(true) : this;
        var el = elms[i];
        var parent = el.parentNode;
        var sibling = el.nextSibling;

        child.appendChild(el);

        if (sibling) {
            parent.insertBefore(child, sibling);
        } else {
            parent.appendChild(child);
        }
    }
};

var createStyleContexMenu = function () {
    document.getElementsByTagName('head')[0].appendChild(document.createElement('style')).innerHTML = ' \
    menu {\
        z-index: 2147483000;\
        position:absolute;\
        display: none;\
        background-color: #eee;\
        margin:0;\
        padding: .5em 0;\
    }\
    menu div{\
        height:1em\
    }\
    menuitem:hover{\
        background-color: #39f;\
        cursor: pointer;\
    }\
    menu div:hover>menuitem{\
        background-color: #39f;\
    }\
    menu>div>menuitem:before {\
        content: ">";\
        position: relative;\
        right: -90%;\
    }\
    menu div:hover>menu{\
        display: block;\
        position: relative;\
        top: -1.5em;\
        right: -100%;\
    }\
    menuitem{\
        display: block;\
        padding: 0 .5em\
    }\
    \
    ';

    document.querySelectorAll('menu[type="context"]').forEach(function (menuRoot) {
        setOnContextMenu(menuRoot);
        menuRoot.querySelectorAll('menuitem').forEach(function (menuitem) {
            menuitem.innerHTML = menuitem.getAttribute('label');
        });
        menuRoot.querySelectorAll('menu').forEach(function (menu) {
            var menuitem = document.createElement('menuitem');
            var div = document.createElement('div');

            div.appendChild(menuitem).innerHTML = menu.getAttribute('label');
            div.wrap(menu);
        });
    });
};

function setOnContextMenu(menu) {
    var menuId = menu.getAttribute('id');
    var targets = document.querySelectorAll('[contextmenu=' + menuId + ']');

    targets.forEach(function (target) {
        target.setAttribute('oncontextmenu', 'return btr.onContextMenuClick(event, ' + menuId + ')');
    });

    document.addEventListener('click', function () {
        menu.style.display = 'none';
    });
}

btr.onContextMenuClick = function (e, menu) {
    menu.style.left = e.clientX + window.pageXOffset + 'px';
    menu.style.top = e.clientY + window.pageYOffset + 'px';
    menu.style.display = 'block';
    e.stopPropagation();

    return false;
};


module.exports = utils.debounce(100, function () {
    if (!/Firefox/.test(window.navigator.userAgent)) {
        createStyleContexMenu();
    }
});
