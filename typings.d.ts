type Key = string | number;

export interface Action<T extends {}> {
  type?: string;
  payload?: T;
  [key: string]: any;
}
export function createActions<T>(actions: T): T;
export interface BuildableReducer<S> {
  (state: S, action): S;
  when<P>(action: Action<P>, handler: (state: S, payload: P) => S | ((state: S) => S)): this;
}
export function createReducer<S extends {}>(initialState: S): BuildableReducer<S>;

export function clone<T>(object: T): T;
export function updateIn<T>(path: Key|Array<Key>, newValue: any, object: T): T;
export function updateIn(path: Key|Array<Key>, newValue: any): (object) => any;
export function removeIn<T>(path: Key|Array<Key>, object: T): T;
export function removeIn(path: Key|Array<Key>): (object) => any;
