"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
function createActions(actions) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === undefined ? '' : _ref$prefix;

    return Object.freeze(Object.keys(actions).reduce(function (actions, type) {
        return __assign({}, actions, _defineProperty({}, type, __assign({ type: '' + prefix + type }, actions[type])));
    }, actions));
}
exports.createActions = createActions;
function action(action, payload) {
    return {
        type: action.type,
        payload: payload
    };
}
exports.action = action;
function createReducer(initialState) {
    var actionHandlers = [];
    function reducer(state, action) {
        return actionHandlers.filter(function (actionHandler) {
            return actionHandler.type === action.type;
        }).reduce(function (state, actionHandler) {
            return actionHandler.handler(state, action.payload);
        }, state || initialState);
    }
    var builder = function builder(state, action) {
        return reducer(state, action);
    };
    builder.when = function (action, _handler) {
        actionHandlers.push({ type: action.type, handler: function handler(state, action) {
                var newState = _handler(state, action);
                if (typeof newState === 'function') {
                    return newState(state);
                }
                return newState;
            } });
        return builder;
    };
    builder.build = function () {
        return reducer;
    };
    return builder;
}
exports.createReducer = createReducer;
function clone(object) {
    return Array.isArray(object) ? [].concat(_toConsumableArray(object)) : __assign({}, object);
}
exports.clone = clone;
function updateIn(path, newValue, object) {
    if (arguments.length === 2) {
        return function (object) {
            return updateIn(path, newValue, object);
        };
    }
    if (Array.isArray(path) && path.length > 1) {
        newValue = updateIn(path.slice(1), newValue, (object || {})[path[0]]);
    }
    var key = Array.isArray(path) ? path[0] : path;
    var cloned = clone(object);
    cloned[key] = newValue;
    return cloned;
}
exports.updateIn = updateIn;
function removeIn(path, object) {
    if (arguments.length === 1) {
        return function (object) {
            return removeIn(path, object);
        };
    }
    if (Array.isArray(path) && path.length > 1) {
        var newValue = removeIn(path.slice(1), (object || {})[path[0]]);
        return updateIn(path[0], newValue, object);
    }
    var key = Array.isArray(path) ? path[0] : path;
    var cloned = clone(object);
    if (Array.isArray(cloned)) {
        cloned.splice(key, 1);
    } else {
        delete cloned[key];
    }
    return cloned;
}
exports.removeIn = removeIn;
//# sourceMappingURL=index.js.map
