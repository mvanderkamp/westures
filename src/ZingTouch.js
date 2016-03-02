/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

import Binder from './core/classes/Binder.js';
import Binding from './core/classes/Binding.js';
import Gesture from './gestures/Gesture.js';
import Pan from './gestures/Pan.js';
import Pinch from './gestures/Pinch.js';
import Tap from './gestures/Tap.js';
import state from './core/state.js';
import util from './core/util.js';

var ZingTouch = {
  //Constructors
  Gesture: Gesture,
  Tap: Tap,
  Pan: Pan,
  Pinch: Pinch,

  /**
   * Bind an element to a registered/unregistered gesture with multiple function signatures.
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Object} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @returns {Object} - a chainable object that has the same function as bind.
   */
  bind(element, gesture, handler, capture) {
    if (element && typeof element.tagName === 'undefined') {
      throw new Error('Parameter element is an invalid object.');
    }

    if (!gesture) {
      return new Binder(element);
    } else {
      if (!isValidGesture(gesture)) {
        throw new Error('Parameter gesture is invalid.');
      }

      if (typeof handler !== 'function') {
        throw new Error('Parameter handler is invalid.');
      }

      state.addBinding(element, gesture, handler, capture);
    }
  },
  /*bind*/

  /**
   * Bind an element and sets up actions to remove the binding once it has been emitted for the first time.
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Object} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @returns {Object} - a chainable object that has the same function as bind.
   */
  bindOnce(element, gesture, handler, capture) {
  },
  /*bindOnce*/

  /**
   * Unbinds an element from either the specified gesture or all if no element is specified.
   * @param {Element|String} element - Either the element to remove or a string key
   * @param {String} gesture - A String representing the gesture
   * @returns {Array} - An array of Gestures that were unbound to the element;
   */
  unbind(element, gesture) {
  },
  /*unbind*/

  /**
   * Registers a new gesture with an assigned key
   * @param {String} key - The key used to register an element to that gesture
   * @param {Object} gesture - A gesture object
   */
  register(key, gesture) {
  }, /*register*/

  /**
   * Un-registers a gesture from ZingTouch's state such that it is no longer emittable.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @returns {Object} - The Gesture object that was unregistered or null if it could not be found.
   */
  unregister(gesture) {
  }
  /*unregister*/

};

/**
 * Determines whether the string is a registered gesture or the object is of type Gesture.
 * @param {string|Object} gesture - Either the gesture or gesture's key
 * @returns {boolean} - true if a valid gesture
 */
function isValidGesture(gesture) {
  return (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1)
    || (gesture instanceof Gesture);
}
/*isValidGesture*/

export {ZingTouch as default, ZingTouch, isValidGesture};
