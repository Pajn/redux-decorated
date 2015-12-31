'use strict';

import {expect} from 'chai';
import {createMockFunction} from '../mock';
import {Action, createActions, createReducer} from 'decorated-redux';

class Actions {
  create: Action<{name: string}> = {};
  save: Action<{}> = {};
}

describe('createActions', () => {
  it('should return an instance with type set on every action', () => {
    const actions = createActions(Actions);

    expect(actions.create).to.deep.equal({type: 'create'});
    expect(actions.save).to.deep.equal({type: 'save'});
  });
});

describe('createReducer', () => {

  it('should return a chainable builder', () => {
    const reducer = createReducer([]);

    expect(reducer.when({}, null)).to.equal(reducer);
  });

  it('should call the correct handler when an action is fired', () => {
    const handler1 = createMockFunction().returns('1');
    const handler2 = createMockFunction().returns('2');
    const reducer = createReducer([])
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)
      .build();

    expect(reducer(undefined, {type: '1'})).to.equal('1');
    expect(handler1.calls.length).to.equal(1);
    expect(handler2.calls.length).to.equal(0);
  });

  it('should return the initial state if no action matches', () => {
    const handler1 = createMockFunction().returns('1');
    const handler2 = createMockFunction().returns('2');
    const reducer = createReducer('0')
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)
      .build();

    expect(reducer(undefined, {type: '3'})).to.equal('0');
    expect(handler1.calls.length).to.equal(0);
    expect(handler2.calls.length).to.equal(0);
  });

  it('should return the current state if no action matches', () => {
    const handler1 = createMockFunction().returns('1');
    const handler2 = createMockFunction().returns('2');
    const reducer = createReducer([])
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)
      .build();

    expect(reducer('3', {type: '0'})).to.equal('3');
    expect(handler1.calls.length).to.equal(0);
    expect(handler2.calls.length).to.equal(0);
  });

  it('should pass the payload and state to the handler', () => {
    const handler = createMockFunction();
    const reducer = createReducer([])
      .when({type: '1'}, handler)
      .build();

    reducer('2', {type: '1', payload: '3'});
    expect(handler.calls.length).to.equal(1);
    expect(handler.calls[0].args).to.deep.equal(['2', '3']);
  });
});