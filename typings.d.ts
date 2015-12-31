declare module 'decorated-redux' {
  type Key = string | number;

  export interface Class<T> {
    new (): T;
  }
  export interface Action<T extends {}> {
    type?: string;
    payload?: T;
  }
  export function createActions<T>(ActionDefinitions: Class<T>): T;
  export interface ReducerBuilder<S> {
    when<P>(action: Action<P>, handler: (state: S, payload: P) => S): ReducerBuilder<S>;
    build(): any;
  }
  export function createReducer<S extends {}>(initialState: S): ReducerBuilder<S>;

  export function clone<T>(object: T): T;
  export function updateIn(path: Key|Array<Key>, newValue: any, object: any): any;
  export function removeIn(path: Key|Array<Key>, object: any): any;
}

declare module 'decorated-redux/react' {
  import {Store} from 'redux';
  import {Action} from 'decorated-redux';
  export interface StoreHelpers<State> {
    dispatch<T>(action: Action<T>, payload?: T): void;
    stateful(getState: (globalState: State) => Object): ClassDecorator;
  }
  export function reactStore<State>(store: Store): StoreHelpers<State>;
}