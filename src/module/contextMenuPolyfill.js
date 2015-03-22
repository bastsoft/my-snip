var utils = require('./utils.js');

function createStyleContexMenu() {
    var fontSize = 14;
    var style = document.createElement('style');
    var css = [
        'menu[type="context"] {',
        '   z-index: 2147483000;',
        '   display: none;',
        '   position:absolute;',
        '   margin:0;',
        '   padding:0;',
        '}',
        'menuitem, menu {',
        '   display:block;',
        '   margin:0;',
        '   padding:0;',
        '   font-family: monospace;',
        '   font-size: ' + fontSize + 'px;',
        '}',
        'menuitem:hover {',
        '   background: #F0F0F0!important;',
        '}',
        'menu{',
        '   background: #F8F8F8!important;',
        '}',
        '.ctxmenumenu .ctxmenuitem, .ctxmenumenu .ctxmenumenu{',
        '   display:none;',
        '}',
        'menu[open="yes"] > .ctxmenuitem, menu[open="yes"] > .ctxmenumenu{',
        '   display:block;',
        '}',
        'menu[open="yes"]:before{',
        '   display:block;',
        '   background: #F0F0F0!important;',
        '}'
    ];
    style.type = 'text/css';

    var addSpaces = function (num) {
        var spaces = '';

        for (var i = 0; i < num; i += 1) {
            spaces += '\\00a0';
        }

        return spaces;
    };

    var maxObj = {};

    function computedMax(rootMenu, menu) {
        var size = (menu.getAttribute('label') || '').length;
        var arr = rootMenu.split('>');

        if ((typeof maxObj[rootMenu] === 'undefined') && (arr.length > 1)) {
            maxObj[rootMenu] = 0;
            rootMenu = arr.slice(0, arr.length - 1).join('>');
        }

        if ((maxObj[rootMenu] || 0) < size) {
            maxObj[rootMenu] = size;
        }
    }

    btr.onContextMenuClick = function (e, menu) {
        menu.style.left = e.clientX + window.pageXOffset + 'px';
        menu.style.top = e.clientY + window.pageYOffset + 'px';
        menu.style.display = 'block';
        e.stopPropagation();

        return false;
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

    function menuQuery(rootMenu) {
        document.querySelectorAll(rootMenu).forEach(function (menu) {
            var root = rootMenu;

            if (rootMenu.split('>').length === 1) {
                setOnContextMenu(menu);

                menu.querySelectorAll('menu').forEach(function (menuitem) {
                    menuitem.setAttribute('class', 'ctxmenumenu ctxelem');
                });
            } else {
                menu.addEventListener('click', function (e) {
                    var open = menu.getAttribute('open');

                    if (!open || open === 'no') {
                        menu.setAttribute('open', 'yes');
                    } else {
                        menu.setAttribute('open', 'no');
                    }
                    e.stopPropagation();
                });
            }

            if (!menu.getAttribute('id')) {
                menu.setAttribute('id', String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now());
            }

            root = rootMenu + '#' + menu.getAttribute('id');

            computedMax(root, menu);

            menu.querySelectorAll(root + '>menuitem').forEach(function (menuitem) {
                menuitem.setAttribute('class', 'ctxmenuitem ctxelem');
                computedMax(root, menuitem);
            });

            menuQuery(root + '>menu');
        });
    }

    menuQuery('menu[type="context"]');

    Object.keys(maxObj).forEach(function (cssQuery) {
        document.querySelectorAll(cssQuery + '>.ctxelem').forEach(function (elem) {
            var label = elem.getAttribute('label').replace(/\ /g, '\\00a0 ').replace(/\-/g, '\\2015 ');
            var beforeCSS = '';
            var menuCSS = '';
            var arr = cssQuery.split('>');
            var item = cssQuery + '>menuitem[label="' + elem.getAttribute('label') + '"]';
            var suffix = '\\00a0';

            if (cssQuery.split('>').length > 1) {
                menuCSS = [
                    'position: relative;',
                    'right: -' + ((maxObj[arr.slice(0, arr.length - 1).join('>')] * (fontSize / 1.5)) + 27) + 'px;',
                    'top: -18px;',
                    'width: 0;'
                ].join('');
            }

            if (elem.tagName === 'MENU') {
                menuCSS += 'height: 20px;';
                beforeCSS += 'position: relative;';
                item = cssQuery + '>menu[label="' + elem.getAttribute('label') + '"]';
                suffix = '>';
            }

            beforeCSS += [
                'background: #F8F8F8;',
                'content:"',
                '\\00a0' + ' ' + label + addSpaces(maxObj[cssQuery] - label.length) + '\\00a0' + suffix + '";'
            ].join('');

            css.push(item + '{ ' + menuCSS + ' }');
            css.push(item + ':before { ' + beforeCSS + ' }');
        });
    });

    style.innerHTML = css.join('');
    document.getElementsByTagName('head')[0].appendChild(style);

}

module.exports = utils.debounce(100, function () {
    if (!/Firefox/.test(window.navigator.userAgent)) {
        NodeList.prototype.forEach = Array.prototype.forEach;
        createStyleContexMenu();
    }
});
