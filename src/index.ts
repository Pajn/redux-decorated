export type Key = string | number
export type Reducer<S> = (state: S, action: Action<any>) => S

export interface Action<T extends {}> {
  type?: string
  payload?: T
  [key: string]: any
}

export interface BuildableReducer<S> {
  (state: S, action): S
  any<P>(handler: Reducer<S>): this
  with<K extends keyof S>(key: K, handler: Reducer<S[K]>): this
  when<P>(action: Action<P>, handler: (state: S, payload: P) => S | ((state: S) => S)): this
  build(): Reducer<S>
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

export function action<T>(action: Action<T>, payload: T): Action<T> & {type: string} {
  return {
    type: action.type!,
    payload,
  }
}

type AnyHandler = Reducer<any>
type SubHandler = {
  key: string
  handler: (state, action) => any
}
type ActionHandler = {
  type: string
  handler: Reducer<any>
}

export function createReducer<T>(initialState: T): BuildableReducer<T> {
  const anyHandlers: Array<AnyHandler> = []
  const subHandlers: Array<SubHandler> = []
  const actionHandlers: Array<ActionHandler> = []

  function reducer(state, action) {
    state = anyHandlers
      .reduce(
        (state, handler) => handler(state, action),
        state || initialState
      )
    state = subHandlers
      .reduce(
        (state, subHandler) => subHandler.handler(state, action),
        state || initialState
      )
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

  builder.any = handler => {
    anyHandlers.push(handler)
    return builder
  }

  builder.with = (key, handler) => {
    subHandlers.push({
      key,
      handler: (state, action) => {
        const subState = handler(state && state[key], action)
        if (subState) {
          return {
            ...state,
            [key]: subState,
          }
        }
        return state
      },
    })
    return builder
  }

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

export function updateIn<E, T extends Array<E>>(index: number, newValue: E, object: T): T
export function updateIn<T, K extends keyof T>(path: K, newValue: T[K], object: T): T
export function updateIn<T, KA extends keyof T, KB extends keyof T[KA]>(path: [KA, KB], newValue: T[KA][KB], object: T): T
export function updateIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB]>(path: [KA, KB, KC], newValue: T[KA][KB][KC], object: T): T
export function updateIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB], KD extends keyof T[KA][KB][KC]>(path: [KA, KB, KC, KD], newValue: T[KA][KB][KC][KD], object: T): T
export function updateIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB], KE extends keyof T[KA][KB][KC][KD]>(path: [KA, KB, KC, KD, KE], newValue: T[KA][KB][KC][KD][KE], object: T): T
export function updateIn(path, newValue, object) {
  return updateInAny(path, newValue, object)
}
export function updateInAny(path: Key|Array<Key>, newValue: any): (object: any) => any
export function updateInAny<T>(path: Key|Array<Key>, newValue: any, object: T): T
export function updateInAny<T>(path: Key|Array<Key>, newValue: any, object?) {
  if (arguments.length === 2) {
    return (object) => updateInAny(path, newValue, object)
  }

  if (Array.isArray(path) && path.length > 1) {
    newValue = updateInAny(path.slice(1), newValue, (object || {})[path[0]])
  }

  const key = Array.isArray(path) ? path[0] : path
  const cloned = clone(object)
  cloned[key] = newValue

  return cloned
}

export function removeIn<T extends Array<any>>(index: number, object: T): T
export function removeIn<T, K extends keyof T>(path: K, object: T): T
export function removeIn<T, KA extends keyof T, KB extends keyof T[KA]>(path: [KA, KB], object: T): T
export function removeIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB]>(path: [KA, KB, KC], object: T): T
export function removeIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB], KD extends keyof T[KA][KB][KC]>(path: [KA, KB, KC, KD], object: T): T
export function removeIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB], KD extends keyof T[KA][KB][KC], KE extends keyof T[KA][KB][KC][KD]>(path: [KA, KB, KC, KD, KE], object: T): T
export function removeIn(path, object) {
  return removeInAny(path, object)
}
export function removeInAny(path: Key|Array<Key>): (object: any) => any
export function removeInAny<T>(path: Key|Array<Key>, object: T): T
export function removeInAny<T>(path: Key|Array<Key>, object?) {
  if (arguments.length === 1) {
    return (object) => removeInAny(path, object)
  }

  if (Array.isArray(path) && path.length > 1) {
    const newValue = removeInAny(path.slice(1), (object || {})[path[0]])
    return updateInAny(path[0], newValue, object)
  }

  const key = Array.isArray(path) ? path[0] : path
  const cloned = clone(object)
  if (Array.isArray(cloned)) {
    cloned.splice(key as number, 1)
  } else {
    delete cloned[key]
  }

  return cloned
}
