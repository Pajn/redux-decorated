import {Store} from 'redux';

export function reactStore(store) {

  return {
    dispatch(action, payload) {
      return store.dispatch({type: action.type, payload});
    },

    stateful(getState) {
      return (target) => {
        const component = (...args) => {
          const component = new target(...args);
          const {componentWillUnmount} = component;
          let dispose;

          component.componentWillUnmount = componentWillUnmount
            ? function (...args) {
              dispose();
              return componentWillUnmount.apply(this, args);
            }
            : () => dispose();

          const state = () => getState(store.getState());

          component.state = component.state
            ? {...component.state, ...state()}
            : state();
          dispose = store.subscribe(() => component.setState(state()));

          return component;
        };

        const methods = Object.getOwnPropertyNames(target)
            .filter(name => !['length', 'name', 'protoype'].includes(name));

        for (const method of methods) {
          component[method] = target[method];
        }

        return component;
      };
    },
  };
}
