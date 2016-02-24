import state from './../state.js';

/**
 * Responsible for keeping track of a binding for a particular element to a gesture
 */
class Binding {
  constructor(element, gesture, handler) {
    this.element = element;
    this.gesture = gesture;
    this.handler = handler;
    for (var key in state.bindings) {
      this[key] = state.bindings;
    }
  }
};

export default Binding;
