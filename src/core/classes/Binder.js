import state from './../state.js';

/**
 * Created from the ZingTouch.bind() event. Creates an object that allows chaining to a specific
 * element.
 * @type {{tap: Binder.tap}}
 */
class Binder {
  constructor(element) {
    this.element = element;
    for (var key in state.bindings) {
      this[key] = state.bindings;
    }
  }
};

export default Binder;
