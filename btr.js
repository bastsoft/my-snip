(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.btr = {};
var utils = require('./module/utils.js');
var config = require('./module/config.js');
var load = require('./module/load.js');
var gist = require('./module/gist.js');
var contextMenu = require('./module/contextMenu.js');
var relay = require('./module/relay.js');

utils.extend(window.btr, load);
utils.extend(window.btr, gist);
utils.extend(window.btr, contextMenu);
utils.extend(window.btr, relay);

window.btr.save = function () {
    utils.saveToJsonFile(btr.config.gists, 'save.json');
};
window.btr.newConfig = config;

},{"./module/config.js":2,"./module/contextMenu.js":3,"./module/gist.js":5,"./module/load.js":6,"./module/relay.js":7,"./module/utils.js":8}],2:[function(require,module,exports){
/**
 * @gists {object} btr.save() data
 */
var utils = require('./utils.js');

window.btr.config = {
    gistUrl: 'https://gist.github.com/'
};

module.exports = function (newConfig) {
    utils.extend(window.btr.config, newConfig || []);
    return window.btr.config;
};

},{"./utils.js":8}],3:[function(require,module,exports){
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

},{"./contextMenuPolyfill.js":4,"./utils.js":8}],4:[function(require,module,exports){
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

},{"./utils.js":8}],5:[function(require,module,exports){
var load = require('./load.js');
var newConfig = require('./config.js');
var config = newConfig();

var functionGist = function (fileName) {
    var returnFunction = null;

    searchGistID(function (gistUrl, idGist) {
        if (gistUrl[idGist][fileName]) {
            returnFunction = new Function('', gistUrl[idGist][fileName].content);
        }
    });

    return returnFunction;
};

var loadGist = function (id, callback) {
    var file = id.file;

    if (id.url) {
        newConfig({
            gistUrl: id.url
        });
    }

    if (file) {
        callback = function () {
            functionGist(file)();
        };
    }

    if (id.id) {
        id = id.id;
    }

    loadGistFromId(id, callback);
};

function loadGistFromId(id, callback) {
    if (findId(id)) {
        callback();
    } else {
        loadGistFromJSONP(id, callback);
    }
}

function findId(id) {
    var find = null;

    searchGistID(function (gistUrl, idGist) {
        if (idGist === id) {
            find = gistUrl[idGist];
        }
    });

    return find;
}

function searchGistID(callback) {
    var gists = config.gists;

    Object.keys(gists || {}).forEach(function (urlGist) {
        Object.keys(gists[urlGist] || {}).forEach(function (idGist) {
            callback(gists[urlGist], idGist);
        });
    });
}

function loadGistFromJSONP(id, callback) {
    load.loadJsonP(config.gistUrl + id + '.json', function (res) {
        var files = _getFilesFromHTML(res.div);
        _addFilesToConfigGists(id, files);
        callback();
    });
}

function _addFilesToConfigGists(id, files) {
    if (!config.gists) {
        config.gists = {};
    }

    if (!config.gists[config.gistUrl]) {
        config.gists[config.gistUrl] = {};
    }

    if (!config.gists[config.gistUrl][id]) {
        config.gists[config.gistUrl][id] = files;
    }
}

function _getFilesFromHTML(htmlData) {
    var gistFiles = htmlData.split('<div class="gist-file">').slice(1);
    var files = {};
    var el = document.createElement('div');
    var getText = function (dataHTML) {
        el.innerHTML = dataHTML.replace(/<\/div>/g, '</div>\n');
        return el.textContent.replace(/\n\n/g, '');
    };

    gistFiles.forEach(function (gistFile) {
        var gistMeta = gistFile.split('<div class="gist-meta">');
        var fileName = getText(gistMeta[1].split('</a>')[1] + '</a>').replace(/[\n  ]/g, '');

        files[fileName] = {
            content: getText(gistMeta[0].split('<td class="line-data">')[1])
        };
    });

    return files;
}

module.exports = {
    loadGist: loadGist,
    functionGist: functionGist
};

},{"./config.js":2,"./load.js":6}],6:[function(require,module,exports){
var utils = require('./utils.js');

var load = function (files, callback) {
    if (typeof files === 'object') {
        _likeArray(files, callback);
    } else {
        return _loadOne.bind(this, files, callback);
    }
};

function _likeArray(files, callback) {
    files.reverse();
    files.forEach(function (obj) {
        var load = (typeof obj === 'object') ? _loadIfNoVar : _loadOne;
        callback = load.bind(this, obj, callback);
    }, this);
    callback();
}

function _loadIfNoVar(obj, callback) {
    (obj[0] ? callback : _loadOne.bind(this, obj[1], callback))();
}

function _loadOne(url, callback) {
    var handler = (url.indexOf('.css') === -1) ? _createScript.bind(this, url) : _createStyle.bind(this, url);
    var elem = handler(function () {
        if (callback) {
            callback();
        }
        elem.parentNode.removeChild(elem);
    });

    document.getElementsByTagName('head')[0].appendChild(elem);
}

function _createScript(url, callback) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;

    if (callback) {
        script.onreadystatechange = callback;
        script.onload = callback;
    }

    return script;
}

function _createStyle(url, callback) {
    var style = document.createElement('link');

    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = url;
    callback();

    return style;
}

var loadJsonP = function (urlJsonFile, callback) {
    var id = utils.uniqId();

    window['fun' + id] = function (data) {
        callback(data);
        delete window['fun' + id];
    };
    load([urlJsonFile + '?callback=fun' + id]);
};

module.exports = {
    load: load,
    loadJsonP: loadJsonP
};

},{"./utils.js":8}],7:[function(require,module,exports){
var relay = function (key, states) {
    var obj = {};

    if (key && !states) {
        states = key;
        key = undefined;
    }

    if (key) {
        obj = createKeyStates(key, states);
    } else {
        obj = addDefaultStates(states);
    }

    return obj;
};

function addDefaultStates(states) {
    var functionContent = '';
    var obj = {};

    Object.keys(states).forEach(function (stateKey) {
        if (typeof states[stateKey] === 'object') {
            states[stateKey] = createKeyStates(stateKey, states[stateKey]);
            obj[((localStorage[stateKey]) ? '☑ ' : '☐ ') + stateKey] = states[stateKey];
        } else {
            obj[stateKey] = states[stateKey];
        }

        functionContent += 'localStorage.removeItem("' + stateKey + '"); ';
    });

    obj['by default'] = (new Function('', functionContent));

    return obj;
}

function createKeyStates(key, states) {
    var obj = {};

    if (localStorage[key]) {
        states[localStorage[key]]();
    }

    Object.keys(states).forEach(function (stateKey) {
        var mark = (localStorage[key] === stateKey) ? '☑ ' : '☐ ';

        obj[mark + stateKey] = function () {
            states[stateKey]();
            localStorage[key] = stateKey;
        };
    });

    obj['by default'] = function () {
        localStorage.removeItem(key);
    };

    return obj;
}

module.exports = {
    relay: relay
};

},{}],8:[function(require,module,exports){
var uniqId = function () {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
};

var saveToJsonFile = function (data, filename) {
    var blob = new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/json' });
    var e = document.createEvent('MouseEvents');
    var a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
};

var extend = function (destination, sources) {
    Object.keys(sources).forEach(function (key) {
        destination[key] = sources[key];
    });
};

var debounce = function (ms, callback) {
    var timeout = null;

    return function () {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(callback, ms);
    };
};

module.exports = {
    uniqId: uniqId,
    saveToJsonFile: saveToJsonFile,
    extend: extend,
    debounce: debounce
};

},{}]},{},[1]);
