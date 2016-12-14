/// <reference types="jest" />
import {createMockFunction} from 'mock-functions'
import {Action, createActions, createReducer, removeIn} from './index'

describe('createActions', () => {
  it('should return an instance with type set on every action', () => {
    const actions = createActions({
      create: {} as Action<{name: string}>,
      save: {
        meta: {
          toString: true,
        }
      } as Action<{}>,
    })

    expect(actions.create).toEqual({type: 'create'})
    expect(actions.save).toEqual({type: 'save', meta: {toString: true}})
  })

  it('should keep properties set on the actions', () => {
    const actions = createActions({
      create: {type: 'new'} as Action<{name: string}>,
    })

    expect(actions.create).toEqual({type: 'new'})
  })

  it('should support setting a prefx', () => {
    const actions = createActions({
      create: {} as Action<{name: string}>,
    }, {prefix: 'test'})

    expect(actions.create).toEqual({type: 'testcreate'})
  })
})

describe('createReducer', () => {

  it('should return a chainable builder', () => {
    const reducer = createReducer([])

    expect(reducer.when({type: 'type'}, (s, a) => s as any)).toEqual(reducer)
  })

  it('should call the correct handler when an action is fired', () => {
    const handler1 = createMockFunction().returns('1')
    const handler2 = createMockFunction().returns('2')
    const reducer = createReducer([])
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)

    expect(reducer([], {type: '1'})).toEqual('1')
    expect(handler1.calls.length).toEqual(1)
    expect(handler2.calls.length).toEqual(0)
  })

  it('should return the initial state if no action matches', () => {
    const handler1 = createMockFunction().returns('1')
    const handler2 = createMockFunction().returns('2')
    const reducer = createReducer('0')
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)

    expect(reducer('', {type: '3'})).toEqual('0')
    expect(handler1.calls.length).toEqual(0)
    expect(handler2.calls.length).toEqual(0)
  })

  it('should return the current state if no action matches', () => {
    const handler1 = createMockFunction().returns('1')
    const handler2 = createMockFunction().returns('2')
    const reducer = createReducer('0')
      .when({type: '1'}, handler1)
      .when({type: '2'}, handler2)

    expect(reducer('3', {type: '0'})).toEqual('3')
    expect(handler1.calls.length).toEqual(0)
    expect(handler2.calls.length).toEqual(0)
  })

  it('should pass the payload and state to the handler', () => {
    const handler = createMockFunction()
    const reducer = createReducer('0')
      .when({type: '1'}, handler)

    reducer('2', {type: '1', payload: '3'})

    expect(handler.calls.length).toEqual(1)
    expect(handler.calls[0].args).toEqual(['2', '3'])
  })

  describe('handlers returning a function to modify state', () => {

    it('should pass the payload and state to the handler', () => {
      const stateMapper = createMockFunction()
      const handler = createMockFunction().returns(stateMapper)
      const reducer = createReducer('0')
        .when({type: '1'}, (_, payload) => handler(payload))

      reducer('2', {type: '1', payload: '3'})

      expect(handler.calls.length).toEqual(1)
      expect(stateMapper.calls.length).toEqual(1)
      expect(handler.calls[0].args).toEqual(['3'])
      expect(stateMapper.calls[0].args).toEqual(['2'])
    })

    it('should return the value returned by the handler', () => {
      const reducer = createReducer('0')
        .when({type: '1'}, _ => _ => '3')

      expect(reducer('2', {type: '1'})).toEqual('3')
    })
  })
})

describe('removeIn', () => {
  it('should be able to remove a deep preoperty', () => {
    const old = {deeply: {nested: {property: true}}}

    const result = removeIn(['deeply', 'nested', 'property'], old)

    expect(old.deeply.nested.property).toBe(true)
    expect(result.deeply.nested.property).not.toBeDefined()
  })

  it('should be able to remove an intem in an array', () => {
    const old = [1, 2, 3]

    const result = removeIn(1, old)

    expect(old).toEqual([1, 2, 3])
    expect(result).toEqual([1, 3])
  })
})
