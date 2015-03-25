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
