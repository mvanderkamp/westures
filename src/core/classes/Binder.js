import state from './../state.js';

/**
 * Generates bindings for the state object.
 */
class Binder {
  constructor(element) {
    this.element = element;

    for (var key in state.registeredGestures) {
      this[key] = function (handler, capture) {
        state.addBinding(this.element, key, handler, capture);
        this.element.addEventListener(key, handler, capture);
        return this;
      };
    }

  }
};

export default Binder;
