import {Store} from 'redux'

export function reactStore(store) {

  return {
    dispatch(action, payload) {
      return store.dispatch({type: action.type, payload})
    },

    stateful(getState, {pure = true} = {}) {
      return target => {
        const component = (...args) => {
          const component = new target(...args)
          const {componentWillMount, componentWillUnmount} = component
          let dispose

          const state = () => {
            component.setState(getState(store.getState()))
            if (dispose) {
              dispose()
            }
            dispose = store.subscribe(() => component.setState(getState(store.getState())))
          }

          component.componentWillMount = componentWillMount
            ? function (...args) {
              state()
              return componentWillMount.apply(this, args)
            }
            : state

          component.componentWillUnmount = componentWillUnmount
            ? function (...args) {
              dispose()
              return componentWillUnmount.apply(this, args)
            }
            : () => dispose()

          if (pure) {
            component.shouldComponentUpdate = (nextProps, nextState) =>
                !shallowEqual(component.props, nextProps) ||
                !shallowEqual(component.state, nextState)
          }

          return component
        }

        const methods = Object.getOwnPropertyNames(target)
            .filter(name => !['length', 'name', 'protoype'].includes(name))

        for (const method of methods) {
          component[method] = target[method]
        }

        return component
      }
    },
  }
}
