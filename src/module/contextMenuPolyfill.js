var utils = require('./utils.js');

Element.prototype.wrap = function (elms) {
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
    var style = document.createElement('style');
    style.type = 'text/css';

    var stylHtml = ' \
    menu {\
        z-index: 2147483000;\
        position:absolute;\
        display: none;\
        background-color: #eee;\
        margin:0;\
        padding: .5em 0;\
        font-family: monospace;\
        font-size: 14px;\
    }\
    menu div{\
        height:1em;\
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
        padding: 0 .5em;\
    }\
    \
    ';

    if (style.styleSheet) {
        style.styleSheet.cssText = stylHtml;
    } else {
        style.innerHTML = stylHtml;
    }

    document.getElementsByTagName('head')[0].appendChild(style);

    Array.prototype.forEach.call(document.querySelectorAll('menu[type="context"]'), function (menuRoot) {
        setOnContextMenu(menuRoot);
        Array.prototype.forEach.call(menuRoot.querySelectorAll('menuitem'), function (menuitem) {
            var label = menuitem.getAttribute('label');

            addMaxWidth(menuitem.parentElement, label.length);
            menuitem.innerHTML = label;
        });
        Array.prototype.forEach.call(menuRoot.querySelectorAll('menu'), function (menu) {
            var menuitem = document.createElement('menuitem');
            var div = document.createElement('div');
            var label = menu.getAttribute('label');

            addMaxWidth(menu.parentElement, label.length);
            div.appendChild(menuitem).innerHTML = label;
            div.wrap(menu);
        });
    });
};

function addMaxWidth(parent, newLength) {
    var oldLength = Number(parent.style.width.replace('px', ''));

    newLength = (newLength * 9) + 35;
    parent.style.width = ((newLength > oldLength) ? newLength : oldLength) + 'px';
}

function setOnContextMenu(menu) {
    var menuId = menu.getAttribute('id');
    var targets = document.querySelectorAll('[contextmenu=' + menuId + ']');
    var onClick = function () {
        menu.style.display = 'none';
    };

    Array.prototype.forEach.call(targets, function (target) {
        target.setAttribute('oncontextmenu', 'return btr.onContextMenuClick(event, ' + menuId + ')');
    });

    if (document.addEventListener) {
        document.addEventListener("click", onClick, false);
    } else {
        document.attachEvent("onclick", onClick);
    }
}

btr.onContextMenuClick = function (e, menu) {
    var scrollOffsets = getScrollOffsets();

    if (menu && menu.style) {
        menu.style.left = e.clientX + scrollOffsets.x + 'px';
        menu.style.top = e.clientY + scrollOffsets.y + 'px';
        menu.style.display = 'block';
    }

    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }

    return false;
};

function getScrollOffsets() {
    var doc = window.document;

    if (window.pageXOffset != null) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    }

    if (document.compatMode === "CSS1Compat") {
        return {
            x: doc.documentElement.scrollLeft,
            y: doc.documentElement.scrollTop
        };
    }

    return {
        x: doc.body.scrollLeft,
        y: doc.body.scrollTop
    };
}

module.exports = utils.debounce(100, function () {
    if (!/Firefox/.test(window.navigator.userAgent)) {
        createStyleContexMenu();
    }
});
