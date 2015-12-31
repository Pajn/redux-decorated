import {Store} from 'redux';

export function reactStore(store) {

  return {
    dispatch(action, payload) {
      return store.dispatch({type: action.type, payload});
    },

    stateful(getState) {
      return (target) => {
        return (...args) => {
          const component = new target(...args);
          const {componentWillUnmount} = component;
          let dispose;

          component.componentWillUnmount = componentWillUnmount
            ? (...args) => {
              dispose();
              return componentWillUnmount.apply(component, args);
            }
            : () => dispose();

          component.state = component.state || getState(store.getState());
          dispose = store.subscribe(() =>
            component.setState(getState(store.getState())));

          return component;
        };
      };
    },
  };
}