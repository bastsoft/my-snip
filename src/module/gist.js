var load = require('./load.js');

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
        btr.config.gistUrl = id.url
    }

    if (file) {
        console.log('file', file);
        callback = function () {
            functionGist(file)();
        };
    }

    if (id.id) {
        id = id.id;
        console.log('id', id);
    }
    loadGist._loadGistFromId(id, callback);
};

loadGist._loadGistFromId = function (id, callback) {
    if (findId(id)) {
        callback();
    } else {
        loadGistFrom(id, callback);
    }
};

function loadGistFrom(id, callback) {
    if (btr.config.gistUrl.indexOf('api') !== -1) {
        loadGist._loadGistFromAPI(id, callback);
    } else {
        loadGist._loadGistFromJSONP(id, callback);
    }
}

loadGist._loadGistFromJSONP = function (id, callback) {
    load.loadJsonP(btr.config.gistUrl + id + '.json', function (res) {
        var files = _getFilesFromHTML(res.div);
        console.log('files : ', files);
        _addFilesToConfigGists(id, files);
        callback();
    });
};

loadGist._loadGistFromAPI = function (id, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', btr.config.gistUrl + id + '?' + (new Date()).getTime(), false);
    xmlHttp.send(null);
    _addFilesToConfigGists(id, JSON.parse(xmlHttp.responseText).files);
    callback();
};

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
    var gists = btr.config.gists;

    Object.keys(gists || {}).forEach(function (urlGist) {
        Object.keys(gists[urlGist] || {}).forEach(function (idGist) {
            callback(gists[urlGist], idGist);
        });
    });
}

function _addFilesToConfigGists(id, files) {
    if (!btr.config.gists) {
        btr.config.gists = {};
    }

    if (!btr.config.gists[btr.config.gistUrl]) {
        btr.config.gists[btr.config.gistUrl] = {};
    }

    if (!btr.config.gists[btr.config.gistUrl][id]) {
        btr.config.gists[btr.config.gistUrl][id] = files;
    }
}

function _getFilesFromHTML(htmlData) {
    var files = {};
    var el = document.createElement('div');
    el.innerHTML = htmlData;

    var gistFiles = el.querySelectorAll('.gist-file .gist-data .file');
    var gistMeta = el.querySelectorAll('.gist-file .gist-meta');

    for (var i = 0; i < gistFiles.length; i++) {
        var fileName = gistMeta[i].querySelectorAll('a')[1].innerText;
        files[fileName] = {
            content: gistFiles[i].innerText.replace(/\n\n/g, '')
        };
    }

    return files;
}

module.exports = {
    loadGist: loadGist,
    functionGist: functionGist
};