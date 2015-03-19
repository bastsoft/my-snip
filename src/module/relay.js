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
