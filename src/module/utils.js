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
