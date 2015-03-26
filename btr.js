(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.btr = {};
var utils = require('./module/utils.js');
var config = require('./module/config.js');
var load = require('./module/load.js');
var gist = require('./module/gist.js');
var contextMenu = require('./module/contextMenu.js');
var relay = require('./module/relay.js');
var tumbler = require('./module/tumbler.js');

utils.extend(window.btr, load);
utils.extend(window.btr, gist);
utils.extend(window.btr, contextMenu);
utils.extend(window.btr, relay);
utils.extend(window.btr, tumbler);

window.btr.save = function () {
    utils.saveToJsonFile(btr.config.gists, 'save.json');
};
window.btr.newConfig = config;

},{"./module/config.js":2,"./module/contextMenu.js":3,"./module/gist.js":5,"./module/load.js":6,"./module/relay.js":7,"./module/tumbler.js":8,"./module/utils.js":9}],2:[function(require,module,exports){
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

},{"./utils.js":9}],3:[function(require,module,exports){
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

    targets.forEach(function (target) {
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
    menuitem.addEventListener('click', callBack, false);

    return menuitem;
}

module.exports = {
    contextMenu: contextMenu
};

},{"./contextMenuPolyfill.js":4,"./utils.js":9}],4:[function(require,module,exports){
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
        font-family: monospace;\
        font-size: 14px;\
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
            var label = menuitem.getAttribute('label');

            addMaxWidth(menuitem.parentElement, label.length);
            menuitem.innerHTML = label;
        });
        menuRoot.querySelectorAll('menu').forEach(function (menu) {
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

    targets.forEach(function (target) {
        target.setAttribute('oncontextmenu', 'return btr.onContextMenuClick(event, ' + menuId + ')');
    });

    document.addEventListener('click', function () {
        menu.style.display = 'none';
    });
}

btr.onContextMenuClick = function (e, menu) {
    if (menu && menu.style) {
        menu.style.left = e.clientX + window.pageXOffset + 'px';
        menu.style.top = e.clientY + window.pageYOffset + 'px';
        menu.style.display = 'block';
    }

    e.stopPropagation();

    return false;
};

module.exports = utils.debounce(100, function () {
    if (!/Firefox/.test(window.navigator.userAgent)) {
        createStyleContexMenu();
    }
});

},{"./utils.js":9}],5:[function(require,module,exports){
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
        el.innerHTML = (dataHTML || '').replace(/<\/div>/g, '</div>\n');
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

},{"./utils.js":9}],7:[function(require,module,exports){
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
var tumbler = function (states) {
    var obj = {};

    Object.keys(states).forEach(function (stateKey) {
        var mark = localStorage[stateKey] ? '☑ ' : '☐ ';

        obj[mark + stateKey] = function () {
            localStorage[stateKey] = localStorage[stateKey] ? '' : 'yes';

            if (localStorage[stateKey]) {
                states[stateKey]();
            }
        };

        if (localStorage[stateKey]) {
            states[stateKey]();
        }
    });

    obj['on all'] = function () {
        Object.keys(states).forEach(function (stateKey) {
            localStorage[stateKey] = 'yes';
            states[stateKey]();
        });
    };

    obj['off all'] = function () {
        Object.keys(states).forEach(function (stateKey) {
            localStorage[stateKey] = '';
        });
    };

    return obj;
};

module.exports = {
    tumbler: tumbler
};

},{}],9:[function(require,module,exports){
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
