"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
function createActions(actions) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === undefined ? '' : _ref$prefix;

    return Object.freeze(Object.keys(actions).reduce(function (actions, type) {
        return Object.assign({}, actions, _defineProperty({}, type, Object.assign({ type: "" + prefix + type }, actions[type])));
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
    var anyHandlers = [];
    var subHandlers = [];
    var actionHandlers = [];
    function reducer(state, action) {
        state = anyHandlers.reduce(function (state, handler) {
            return handler(state, action);
        }, state || initialState);
        state = subHandlers.reduce(function (state, subHandler) {
            return subHandler.handler(state, action);
        }, state || initialState);
        return actionHandlers.filter(function (actionHandler) {
            return actionHandler.type === action.type;
        }).reduce(function (state, actionHandler) {
            return actionHandler.handler(state, action.payload);
        }, state || initialState);
    }
    var builder = function builder(state, action) {
        return reducer(state, action);
    };
    builder.any = function (handler) {
        anyHandlers.push(handler);
        return builder;
    };
    builder.with = function (key, _handler) {
        subHandlers.push({
            key: key,
            handler: function handler(state, action) {
                var subState = _handler(state && state[key], action);
                if (subState) {
                    return Object.assign({}, state, _defineProperty({}, key, subState));
                }
                return state;
            }
        });
        return builder;
    };
    builder.when = function (action, _handler2) {
        actionHandlers.push({ type: action.type, handler: function handler(state, action) {
                var newState = _handler2(state, action);
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
    return Array.isArray(object) ? [].concat(_toConsumableArray(object)) : Object.assign({}, object);
}
exports.clone = clone;
function updateIn(path, newValue, object) {
    return updateInAny(path, newValue, object);
}
exports.updateIn = updateIn;
function updateInAny(path, newValue, object) {
    if (arguments.length === 2) {
        return function (object) {
            return updateInAny(path, newValue, object);
        };
    }
    if (Array.isArray(path) && path.length > 1) {
        newValue = updateInAny(path.slice(1), newValue, (object || {})[path[0]]);
    }
    var key = Array.isArray(path) ? path[0] : path;
    var cloned = clone(object);
    cloned[key] = newValue;
    return cloned;
}
exports.updateInAny = updateInAny;
function removeIn(path, object) {
    return removeInAny(path, object);
}
exports.removeIn = removeIn;
function removeInAny(path, object) {
    if (arguments.length === 1) {
        return function (object) {
            return removeInAny(path, object);
        };
    }
    if (Array.isArray(path) && path.length > 1) {
        var newValue = removeInAny(path.slice(1), (object || {})[path[0]]);
        return updateInAny(path[0], newValue, object);
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
exports.removeInAny = removeInAny;
//# sourceMappingURL=index.js.map
