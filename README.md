# redux-decorated
Helpers for Redux designed to work great with Typescript.

You describe the possible actions using an object as such:
```
const actions = {
  addTodo: {type: 'addTodo'} as Action<{todo: Todo}>,
}
```
If you don't want to repeat the type you can use the `createActions` helper which will
automatically set the type key from the key of the actions object:
```
import {createActions} from 'redux-decorated'

const actions = createActions({
  addTodo: {} as Action<{todo: Todo}>,
})
```

To get type information in the reducers, use the `createReducer` function:
```
import {createReducer} from 'redux-decorated'

export const todos = createReducer<Todo[]>([]) // Initial state is passed in the parameter
  .when(actions.addTodo, (state, {todo}) => [...state, todo])
```
the `createReducer` function returns a "buildable reducer" which you can add action handlers too by
chaining `.when` calls. The first parameter is the action object and the second is a function that
receives the previous/current state as the first parameter, the action payload as the second and
is expected to return a new state object. Both the state and the payload arguments gets fully
type-infered by Typescript which gives you the usual benefits with autocomplete and warnings.
