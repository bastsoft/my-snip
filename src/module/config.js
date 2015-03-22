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
