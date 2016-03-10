/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

import Binder from './core/classes/Binder.js';
import Binding from './core/classes/Binding.js';
import Gesture from './gestures/Gesture.js';
import Expand from './gestures/Expand.js';
import Pan from './gestures/Pan.js';
import Pinch from './gestures/Pinch.js';
import Rotate from './gestures/Rotate.js';
import Swipe from './gestures/Swipe.js';
import Tap from './gestures/Tap.js';
import state from './core/state.js';
import util from './core/util.js';

/**
 * The global API interface for ZingTouch
 * @type {Object}
 * @namespace ZingTouch
 */
var ZingTouch = {
  //Constructors
  Gesture: Gesture,
  Expand: Expand,
  Pan: Pan,
  Pinch: Pinch,
  Tap: Tap,
  Rotate: Rotate,
  Swipe: Swipe,

  /**
   * Bind an element to a registered/unregistered gesture with multiple function signatures.
   * @memberof ZingTouch
   * @example
   * bind(element) - chainable
   * @example
   * bind(element, gesture, handler, [capture])
   * @param {Element} element - The element object.
   * @param {String|Object} [gesture] - Gesture key, or a Gesture object.
   * @param {Function} [handler] - The function to execute when an event is emitted.
   * @param {Boolean} [capture] - capture/bubble
   * @param {Boolean} [bindOnce = false] - Option to bind once and only emit the event once.
   * @returns {Object} - a chainable object that has the same function as bind.
   */
  bind(element, gesture, handler, capture, bindOnce) {
    bindOnce = (bindOnce) ? bindOnce : false;

    if (element && typeof element.tagName === 'undefined') {
      throw new Error('Parameter element is an invalid object.');
    }

    if (!gesture) {
      return new Binder(element, bindOnce);
    } else {
      if (!isValidGesture(gesture)) {
        throw new Error('Parameter gesture is invalid.');
      }

      if (typeof handler !== 'function') {
        throw new Error('Parameter handler is invalid.');
      }

      state.addBinding(element, gesture, handler, capture, bindOnce);
    }
  },
  /*bind*/

  /**
   * Bind an element and sets up actions to remove the binding once it has been emitted for the first time.
   * @memberof ZingTouch
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Object} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @returns {Object} - a chainable object that has the same function as bind.
   */
  bindOnce(element, gesture, handler, capture) {
    this.bind(element, gesture, handler, capture, true);
  },
  /*bindOnce*/

  /**
   * Unbinds an element from either the specified gesture or all if no element is specified.
   * @memberof ZingTouch
   * @param {Element|String} element - Either the element to remove or a string key
   * @param {String} gesture - A String representing the gesture
   * @returns {Array} - An array of Bindings that were unbound to the element;
   */
  unbind(element, gesture) {
    var bindings = state.retrieveBindings(element);
    var unbound = [];
    var i = bindings.length - 1;
    while (i > -1) {
      if (gesture) {
        if (bindings[i].element === element) {
          element.removeEventListener(bindings[i].gesture.getId(), bindings[i].handler, bindings[i].capture);
          unbound.push(bindings.splice(i, 1));
        }
      } else {
        element.removeEventListener(bindings[i].gesture.getId(), bindings[i].handler, bindings[i].capture);
        unbound.push(bindings.splice(i, 1));
      }

      i--;
    }
  },
  /*unbind*/

  /**
   * Registers a new gesture with an assigned key
   * @param {String} key - The key used to register an element to that gesture
   * @param {Object} gesture - A gesture object
   */
  register(key, gesture) {
    if (typeof key !== 'string') {
      throw new Error('Parameter key is an invalid string');
    }

    if (!gesture instanceof Gesture) {
      throw new Error('Parameter gesture is an invalid Gesture object');
    }

    gesture.setType(key);
    state.registeredGestures[key] = gesture;
  }, /*register*/

  /**
   * Un-registers a gesture from ZingTouch's state such that it is no longer emittable. Unbinds all events that were registered
   * with the type.
   * @param {String|Object} key - Gesture key that was used to register the object
   * @returns {Object} - The Gesture object that was unregistered or null if it could not be found.
   */
  unregister(key) {
    for (var i = 0; i < state.bindings.length; i++) {
      var binding = state.bindings[i];
      if (binding.gesture.getType() === key) {
        binding.element.removeEventListener(binding.gesture.getId(), binding.handler, binding.capture);
      }
    }

    var registeredGesture = state.registeredGestures[key];
    delete state.registeredGestures[key];
    return registeredGesture;
  }
  /*unregister*/

};

/**
 * Determines whether the string is a registered gesture or the object is of type Gesture.
 * @private
 * @param {string|Object} gesture - Either the gesture or gesture's key
 * @returns {boolean} - true if a valid gesture
 */
function isValidGesture(gesture) {
  return (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1)
    || (gesture instanceof Gesture);
}
/*isValidGesture*/

export {ZingTouch as default, ZingTouch, isValidGesture};
