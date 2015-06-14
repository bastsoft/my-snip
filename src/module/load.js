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
        if (elem.readyState && elem.readyState !== "complete" && elem.readyState !== "loaded") {
            return false;
        }

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
        window['fun' + id] = null;
    };
    load([urlJsonFile + '?callback=fun' + id]);
};

module.exports = {
    load: load,
    loadJsonP: loadJsonP
};
