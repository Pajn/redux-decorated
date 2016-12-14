export type Key = string | number

export interface Action<T extends {}> {
  type?: string
  payload?: T
  [key: string]: any
}

export interface BuildableReducer<S> {
  (state: S, action): S
  when<P>(action: Action<P>, handler: (state: S, payload: P) => S | ((state: S) => S)): this
  build(): (state: S, action) => S
}

export function createActions<T>(actions: T, {prefix = ''}: {prefix?: string} = {}): T {
  return Object.freeze(
    Object.keys(actions).reduce(
      (actions, type) => ({
        ...actions as any,
        [type]: {type: `${prefix}${type}`, ...actions[type]},
      }),
      actions
    )
  )
}

export function action<T>(action: Action<T>, payload: T): Action<T> {
  return {
    type: action.type,
    payload,
  }
}

type ActionHandler = {
  type: string
  handler: (state, action) => any
}

export function createReducer<T>(initialState: T): BuildableReducer<T> {
  const actionHandlers: Array<ActionHandler> = []

  function reducer(state, action) {
    return actionHandlers
        .filter(actionHandler => actionHandler.type === action.type)
        .reduce(
            (state, actionHandler) => actionHandler.handler(state, action.payload),
            state || initialState
        )
  }

  const builder = function builder(state, action) {
    return reducer(state, action)
  } as BuildableReducer<any>

  builder.when = (action, handler) => {
    actionHandlers.push({type: action.type, handler: (state, action) => {
      const newState = handler(state, action)

      if (typeof newState === 'function') {
        return newState(state)
      }
      return newState
    }})
    return builder
  }

  builder.build = () => reducer

  return builder
}

export function clone<T>(object: T): T {
  return Array.isArray(object)
    ? [...object]
    : {...object as any}
}

export function updateIn(path: Key|Array<Key>, newValue: any): (object) => any
export function updateIn<T>(path: Key|Array<Key>, newValue: any, object: T): T
export function updateIn(path, newValue, object?) {
  if (arguments.length === 2) {
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

export function removeIn(path: Key|Array<Key>): (object) => any
export function removeIn<T>(path: Key|Array<Key>, object: T): T
export function removeIn(path, object?) {
  if (arguments.length === 1) {
    return (object) => removeIn(path, object)
  }

  if (Array.isArray(path) && path.length > 1) {
    const newValue = removeIn(path.slice(1), (object || {})[path[0]])
    return updateIn(path[0], newValue, object)
  }

  const key = Array.isArray(path) ? path[0] : path
  const cloned = clone(object)
  if (Array.isArray(cloned)) {
    cloned.splice(key, 1)
  } else {
    delete cloned[key]
  }

  return cloned
}
