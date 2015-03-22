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
