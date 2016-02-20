import state from './core/state.js';
import Gesture from './gestures/Gesture.js';
import Tap from './gestures/Tap.js';
import util from './core/util.js';
import Binder from './core/classes/Binder.js';

/**
 * Responsible for creating and destroying bound events, along with appending operations to them.
 * @type {{Gesture: Gesture, Tap: Tap, bind: ZingTouch.bind, unbind: ZingTouch.unbind}}
 */
var ZingTouch = {
  //Constructors
  Gesture: Gesture,
  Tap: Tap,

  /**
   * Bind an element to a specific registered gesture with multiple function signatures.
   * bind(element)
   * bind(element, gesture, handler, [capture])
   * @param {mixed} element - = The element object.
   * @param {mixed} gesture - Either a string, or a Gesture object.
   * @param {Function} handler - The function to execute when an event is emitted.
   * @param {boolean} capture - capture/bubble
   * @returns {object} - a chainable object that has the same function as bind.
   */
  bind: function (element, gesture, handler, capture) {
    if (element && element.tagName !== 'undefined') {
      //Determine function signature
      if (!gesture) {
        return new Binding(element);
      }

    if(type = util.getGestureType(gesture)) {
        state.addBinding(element, gesture);
        element.addEventListener(type, handler, capture);
      }

    }
  },

  bindOnce: function () {

  },

  /**
   * Unbinds an element from either the specified gesture or all if not specified.
   * @param {mixed} element - Retrieves either the element to remove or a qualified string to pass to querySelector
   * @param {string} gesture - A String representing the gesture, or the Gesture object used to originally bind.
   */
  unbind: function (element, gesture) {
  },

  unregister: function () {
  },

  register: function () {
  }
};

export default ZingTouch;
