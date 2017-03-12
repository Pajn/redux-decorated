"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
var mock_functions_1 = require("mock-functions");
var index_1 = require("./index");
describe('createActions', function () {
    it('should return an instance with type set on every action', function () {
        var actions = index_1.createActions({
            create: {},
            save: {
                meta: {
                    toString: true
                }
            }
        });
        expect(actions.create).toEqual({ type: 'create' });
        expect(actions.save).toEqual({ type: 'save', meta: { toString: true } });
    });
    it('should keep properties set on the actions', function () {
        var actions = index_1.createActions({
            create: { type: 'new' }
        });
        expect(actions.create).toEqual({ type: 'new' });
    });
    it('should support setting a prefx', function () {
        var actions = index_1.createActions({
            create: {}
        }, { prefix: 'test' });
        expect(actions.create).toEqual({ type: 'testcreate' });
    });
});
describe('createReducer', function () {
    it('should return a chainable builder', function () {
        var reducer = index_1.createReducer([]);
        expect(reducer.when({ type: 'type' }, function (s, a) {
            return s;
        })).toEqual(reducer);
    });
    it('should call the correct handler when an action is fired', function () {
        var handler1 = mock_functions_1.createMockFunction().returns('1');
        var handler2 = mock_functions_1.createMockFunction().returns('2');
        var reducer = index_1.createReducer([]).when({ type: '1' }, handler1).when({ type: '2' }, handler2);
        expect(reducer([], { type: '1' })).toEqual('1');
        expect(handler1.calls.length).toEqual(1);
        expect(handler2.calls.length).toEqual(0);
    });
    it('should return the initial state if no action matches', function () {
        var handler1 = mock_functions_1.createMockFunction().returns('1');
        var handler2 = mock_functions_1.createMockFunction().returns('2');
        var reducer = index_1.createReducer('0').when({ type: '1' }, handler1).when({ type: '2' }, handler2);
        expect(reducer('', { type: '3' })).toEqual('0');
        expect(handler1.calls.length).toEqual(0);
        expect(handler2.calls.length).toEqual(0);
    });
    it('should return the current state if no action matches', function () {
        var handler1 = mock_functions_1.createMockFunction().returns('1');
        var handler2 = mock_functions_1.createMockFunction().returns('2');
        var reducer = index_1.createReducer('0').when({ type: '1' }, handler1).when({ type: '2' }, handler2);
        expect(reducer('3', { type: '0' })).toEqual('3');
        expect(handler1.calls.length).toEqual(0);
        expect(handler2.calls.length).toEqual(0);
    });
    it('should pass the payload and state to the handler', function () {
        var handler = mock_functions_1.createMockFunction();
        var reducer = index_1.createReducer('0').when({ type: '1' }, handler);
        reducer('2', { type: '1', payload: '3' });
        expect(handler.calls.length).toEqual(1);
        expect(handler.calls[0].args).toEqual(['2', '3']);
    });
    describe('handlers returning a function to modify state', function () {
        it('should pass the payload and state to the handler', function () {
            var stateMapper = mock_functions_1.createMockFunction();
            var handler = mock_functions_1.createMockFunction().returns(stateMapper);
            var reducer = index_1.createReducer('0').when({ type: '1' }, function (_, payload) {
                return handler(payload);
            });
            reducer('2', { type: '1', payload: '3' });
            expect(handler.calls.length).toEqual(1);
            expect(stateMapper.calls.length).toEqual(1);
            expect(handler.calls[0].args).toEqual(['3']);
            expect(stateMapper.calls[0].args).toEqual(['2']);
        });
        it('should return the value returned by the handler', function () {
            var reducer = index_1.createReducer('0').when({ type: '1' }, function (_) {
                return function (_) {
                    return '3';
                };
            });
            expect(reducer('2', { type: '1' })).toEqual('3');
        });
    });
});
describe('removeIn', function () {
    it('should be able to remove a deep preoperty', function () {
        var old = { deeply: { nested: { property: true } } };
        var result = index_1.removeIn(['deeply', 'nested', 'property'], old);
        expect(old.deeply.nested.property).toBe(true);
        expect(result.deeply.nested.property).not.toBeDefined();
    });
    it('should be able to remove an intem in an array', function () {
        var old = [1, 2, 3];
        var result = index_1.removeIn(1, old);
        expect(old).toEqual([1, 2, 3]);
        expect(result).toEqual([1, 3]);
    });
});
//# sourceMappingURL=index.test.js.map
