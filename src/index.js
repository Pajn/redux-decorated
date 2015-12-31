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

  return {
    when(action, handler) {
      actionHandlers.push({type: action.type, handler});
      return this;
    },
    build() {
      return (state, action) => {
        actionHandlers
          .filter(actionHandler => actionHandler.type === action.type)
          .forEach(actionHandler => state = actionHandler.handler(state, action.payload));

        return state || initialState;
      };
    },
  };
}

export function clone(object) {
  return Array.isArray(object)
    ? [...object]
    : Object.assign({}, object);
}

export function updateIn(path, newValue, object) {
  if (Array.isArray(path) && path.length > 1) {
    newValue = updateIn(path.slice(1), newValue, object[path[0]]);
  }

  const cloned = clone(object);
  cloned[path[0]] = newValue;

  return cloned;
}

export function removeIn(path, object) {
  if (Array.isArray(path) && path.length > 1) {
    newValue = removeIn(path.slice(1), object[path[0]]);
  }

  const cloned = clone(object);
  delete cloned[path[0]];

  return cloned;
}
