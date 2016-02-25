import state from './../state.js';

/**
 * Generates bindings for the state object.
 */
class Binder {
  constructor(element) {
    this.element = element;

    for (var key in state.registeredGestures) {
      if (state.registeredGestures.hasOwnProperty(key)) {

        (function (key) {
          this[key] = function (handler, capture) {
            state.addBinding(this.element, key, handler, capture);

            this.element.addEventListener(key, handler, capture);
            return this;
          };
        })(key);

      }
    }

  }
}

export default Binder;
