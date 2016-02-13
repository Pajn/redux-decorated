export function createActions(ActionDefinitions) {
  const actionDefinitins = new ActionDefinitions();
  return Object.freeze(
    Object.keys(actionDefinitins).reduce((actions, type) => {
      const actionDefinition = actionDefinitins[type];

      actions[type] = Object.create(actionDefinition);
      actions[type].type = type;
      return actions;
   }, actionDefinitins));
}

export function createReducer(initialState) {
  const actionHandlers = [];

  function reducer(state, action) {
    return actionHandlers
        .filter(actionHandler => actionHandler.type === action.type)
        .reduce(
            (state, actionHandler) => actionHandler.handler(state, action.payload),
            state || initialState
        );
  }

  reducer.when = (action, handler) => {
    if (handler.length === 1) {
      const origHandler = handler;
      handler = (state, payload) => origHandler(payload)(state);
    }
    actionHandlers.push({type: action.type, handler});
    return reducer;
  };

  return reducer;
}

export function clone(object) {
  return Array.isArray(object)
    ? [...object]
    : {...object};
}

export function updateIn(path, newValue, object) {
  if (arguments.length == 2) {
    return (object) => updateIn(path, newValue, object);
  }

  if (Array.isArray(path) && path.length > 1) {
    newValue = updateIn(path.slice(1), newValue, (object || {})[path[0]]);
  }

  const key = Array.isArray(path) ? path[0] : path;
  const cloned = clone(object);
  cloned[key] = newValue;

  return cloned;
}

export function removeIn(path, object) {
  if (arguments.length == 1) {
    return (object) => removeIn(path, object);
  }

  if (Array.isArray(path) && path.length > 1) {
    newValue = removeIn(path.slice(1), (object || {})[path[0]]);
  }

  const key = Array.isArray(path) ? path[0] : path;
  const cloned = clone(object);
  delete cloned[key];

  return cloned;
}
