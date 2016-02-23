var contextMenu = require('./module/contextMenu.js');
var contextMenuPolyfill = require('./module/contextMenuPolyfill.js');
var load = require('./module/load.js');
var gist = require('./module/gist.js');
var relay = require('./module/relay.js');
var tumbler = require('./module/tumbler.js');

exports.contextMenu = contextMenu;
exports.onContextMenuClick = contextMenuPolyfill.onContextMenuClick;
exports.load = load.load;
exports.loadJsonP = load.loadJsonP;
exports.loadGist = gist.loadGist;
exports.functionGist = gist.functionGist;
exports.relay = gist.relay;
exports.tumbler = gist.tumbler;

exports.config = {
    gistUrl: 'https://gist.github.com/'
};
