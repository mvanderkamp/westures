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
  /**
   * Constructor function for the Binder class.
   * @param {Element} element - The element to bind gestures to.
   * @param {Boolean} bindOnce - Option to bind once and only emit the event once.
   * @returns {Object} - Returns 'this' to be chained over and over again.
   */
  constructor(element, bindOnce) {
    /**
     * The element to bind gestures to.
     * @type {Element}
     */
    this.element = element;
    for (var key in state.registeredGestures) {
      if (state.registeredGestures.hasOwnProperty(key)) {
        (function (key, self) {
          self[key] = function (handler, capture) {
            state.addBinding(self.element, key, handler, capture, bindOnce);
            return self;
          };
        })(key, this);
      }
    }
  }
  /*constructor*/
}

export default Binder;
