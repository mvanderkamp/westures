/**
 * @file Binder.js
 */
import state from './../state.js';

/**
 * A chainable object that contains a single element to be bound upon.
 * Called from ZingTouch.bind(), and is used to chain over gesture callbacks.
 * @class
 */
class Binder {
  constructor(element) {
    this.element = element;
    for (var key in state.registeredGestures) {
      if (state.registeredGestures.hasOwnProperty(key)) {
        (function (key, self) {
          self[key] = function (handler, capture) {
            state.addBinding(self.element, key, handler, capture);
            return self;
          };
        })(key, this);
      }
    }
  }
}

export default Binder;
