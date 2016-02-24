import state from './../state.js';

/**
 * Responsible for keeping track of a binding for a particular element to a gesture
 */
class Binding {
  constructor(element, gesture, handler, capture) {
    this.element = element;
    this.gesture = gesture;
    this.handler = handler;
    this.capture = capture;
  }
};

export default Binding;
