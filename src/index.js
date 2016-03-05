export function createActions(actions) {
  return Object.freeze(
    Object.keys(actions).reduce(
      (actions, type) => ({...actions, [type]: Object.assign({type}, actions[type])}),
      actions
    )
  )
}

export function createReducer(initialState) {
  const actionHandlers = []

  function reducer(state, action) {
    return actionHandlers
        .filter(actionHandler => actionHandler.type === action.type)
        .reduce(
            (state, actionHandler) => actionHandler.handler(state, action.payload),
            state || initialState
        )
  }

  reducer.when = (action, handler) => {
    actionHandlers.push({type: action.type, handler: (state, action) => {
      const newState = handler(state, action)

      if (typeof newState === 'function') {
        return newState(state)
      }
      return newState
    }})
    return reducer
  }

  return reducer
}

export function clone(object) {
  return Array.isArray(object)
    ? [...object]
    : {...object}
}

export function updateIn(path, newValue, object) {
  if (arguments.length == 2) {
    return (object) => updateIn(path, newValue, object)
  }

  if (Array.isArray(path) && path.length > 1) {
    newValue = updateIn(path.slice(1), newValue, (object || {})[path[0]])
  }

  const key = Array.isArray(path) ? path[0] : path
  const cloned = clone(object)
  cloned[key] = newValue

  return cloned
}

export function removeIn(path, object) {
  if (arguments.length == 1) {
    return (object) => removeIn(path, object)
  }

  if (Array.isArray(path) && path.length > 1) {
    const newValue = removeIn(path.slice(1), (object || {})[path[0]])
    return updateIn(path[0], newValue, object)
  }

  const key = Array.isArray(path) ? path[0] : path
  const cloned = clone(object)
  delete cloned[key]

  return cloned
}
