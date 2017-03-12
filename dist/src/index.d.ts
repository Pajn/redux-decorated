export declare type Key = string | number;
export declare type Reducer<S> = (state: S, action: Action<any>) => S;
export interface Action<T extends {}> {
    type?: string;
    payload?: T;
    [key: string]: any;
}
export interface BuildableReducer<S> {
    (state: S, action: any): S;
    any<P>(handler: Reducer<S>): this;
    with<K extends keyof S>(key: K, handler: Reducer<S[K]>): this;
    when<P>(action: Action<P>, handler: (state: S, payload: P) => S | ((state: S) => S)): this;
    build(): Reducer<S>;
}
export declare function createActions<T>(actions: T, {prefix}?: {
    prefix?: string;
}): T;
export declare function action<T>(action: Action<T>, payload: T): Action<T> & {
    type: string;
};
export declare function createReducer<T>(initialState: T): BuildableReducer<T>;
export declare function clone<T>(object: T): T;
export declare function updateIn<E, T extends Array<E>>(index: number, newValue: E, object: T): T;
export declare function updateIn<T, K extends keyof T>(path: K, newValue: T[K], object: T): T;
export declare function updateIn<T, KA extends keyof T, KB extends keyof T[KA]>(path: [KA, KB], newValue: T[KA][KB], object: T): T;
export declare function updateIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB]>(path: [KA, KB, KC], newValue: T[KA][KB][KC], object: T): T;
export declare function updateInAny(path: Key | Array<Key>, newValue: any): (object: any) => any;
export declare function updateInAny<T>(path: Key | Array<Key>, newValue: any, object: T): T;
export declare function removeIn<T extends Array<any>>(index: number, object: T): T;
export declare function removeIn<T, K extends keyof T>(path: K, object: T): T;
export declare function removeIn<T, KA extends keyof T, KB extends keyof T[KA]>(path: [KA, KB], object: T): T;
export declare function removeIn<T, KA extends keyof T, KB extends keyof T[KA], KC extends keyof T[KA][KB]>(path: [KA, KB, KC], object: T): T;
export declare function removeInAny(path: Key | Array<Key>): (object: any) => any;
export declare function removeInAny<T>(path: Key | Array<Key>, object: T): T;
