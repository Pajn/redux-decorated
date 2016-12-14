export declare type Key = string | number;
export interface Action<T extends {}> {
    type?: string;
    payload?: T;
    [key: string]: any;
}
export interface BuildableReducer<S> {
    (state: S, action: any): S;
    when<P>(action: Action<P>, handler: (state: S, payload: P) => S | ((state: S) => S)): this;
    build(): (state: S, action) => S;
}
export declare function createActions<T>(actions: T, {prefix}?: {
    prefix?: string;
}): T;
export declare function action<T>(action: Action<T>, payload: T): Action<T>;
export declare function createReducer<T>(initialState: T): BuildableReducer<T>;
export declare function clone<T>(object: T): T;
export declare function updateIn(path: Key | Array<Key>, newValue: any): (object) => any;
export declare function updateIn<T>(path: Key | Array<Key>, newValue: any, object: T): T;
export declare function removeIn(path: Key | Array<Key>): (object) => any;
export declare function removeIn<T>(path: Key | Array<Key>, object: T): T;
