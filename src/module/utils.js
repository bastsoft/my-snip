var uniqId = function () {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (+(new Date));
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

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(scope) {
        var
            callback = this,
            prepend = Array.prototype.slice.call(arguments, 1),
            Constructor = function () {
            },
            bound = function () {
                return callback.apply(
                    this instanceof Constructor && scope ? this : scope,
                    prepend.concat(Array.prototype.slice.call(arguments, 0))
                );
            };

        Constructor.prototype = bound.prototype = callback.prototype;

        return bound;
    };
}

if (typeof Object !== "undefined" && !Object.keys) {
    Object.keys = function keys(object) {
        var buffer = [], key;

        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                buffer.push(key);
            }
        }

        return buffer;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, scope) {
        for (var array = this, index = 0, length = array.length; index < length; ++index) {
            callback.call(scope || window, array[index], index, array);
        }
    };
}

module.exports = {
    uniqId: uniqId,
    saveToJsonFile: saveToJsonFile,
    extend: extend,
    debounce: debounce
};