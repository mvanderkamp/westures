/**
 * @file Region.js
 */

import Binder from './Binder.js';
import Binding from './Binding.js';
import Gesture from './../../gestures/Gesture.js';
import arbiter from './../arbiter.js';
import State from './State.js';
import util from './../util.js';

/**
 * Allows the user to specify a region to capture all events to feed ZingTouch into. This can be as narrow as
 * the element itself, or as big as the document itself. The more specific an area, the better performant the
 * overall application will perform. Contains API methods to bind/unbind specific elements
 * to corresponding gestures. Also contains the ability to register/unregister new gestures.
 * @class Region
 */
class Region {

  /**
   * Constructor function for the Region class.
   * @param {Element} element - The element to capture all window events in that region to feed into ZingTouch.
   * @param {boolean} [capture=false] - Whether the region listens for captures or bubbles.
   * @param {boolean} [preventDefault=true] - Whether the default browser functionality should be disabled;
   * @param {String} id - The id of the region, assigned by the ZingTouch object.
   */
  constructor(element, capture, preventDefault, id) {

    /**
     * The identifier for the Region. This is assigned by the ZingTouch object and is used to hash gesture ids
     * for uniqueness.
     * @type {String}
     */
    this.id = id;

    /**
     * The internal state object for a Region. Keeps track of registered gestures, inputs, and events.
     * @type {State}
     */
    this.state = new State(id);

    /**
     * Boolean to disable browser functionality such as scrolling and zooming over the region
     * @type {boolean}
     */
    this.preventDefault = (preventDefault) ? preventDefault : true;

    /**
     * The element being bound to.
     * @type {Element}
     */
    this.element = element;
    capture = (capture) ? capture : false;
    var eventNames = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
    for (var i = 0; i < eventNames.length; i++) {
      let _this = this;
      element.addEventListener(eventNames[i], function (e) {
        arbiter(e, _this);
      }, capture);
    }
  }

  /**
   * Bind an element to a registered/unregistered gesture with multiple function signatures.
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
      return new Binder(element, bindOnce, this.state);
    } else {

      if (typeof gesture === 'string' && Object.keys(this.state.registeredGestures).indexOf(gesture) === -1) {
        throw new Error('Parameter ', gesture, ' is not a registered gesture');
      }

      if (typeof gesture === 'object' && !(gesture instanceof Gesture)) {
        throw new Error('Parameter ', gesture, 'is not of a Gesture type');
      }

      if (typeof handler !== 'function') {
        throw new Error('Parameter handler is invalid.');
      }

      this.state.addBinding(element, gesture, handler, capture, bindOnce);
    }
  }

  /*bind*/

  /**
   * Bind an element and sets up actions to remove the binding once it has been emitted
   * for the first time.
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Element} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @returns {Object} - a chainable object that has the same function as bind.
   */
  bindOnce(element, gesture, handler, capture) {
    this.bind(element, gesture, handler, capture, true);
  }

  /*bindOnce*/

  //noinspection JSMethodCanBeStatic
  /**
   * Unbinds an element from either the specified gesture or all if no element is specified.
   * @param {Element|String} element - Either the element to remove or a string key
   * @param {String} gesture - A String representing the gesture
   * @returns {Array} - An array of Bindings that were unbound to the element;
   */
  unbind(element, gesture) {
    var bindings = state.retrieveBindingsByElement(element);
    var unbound = [];
    var i = bindings.length - 1;
    while (i > -1) {

      if ((gesture && (bindings[i].element === element)) && !gesture) {
        element.removeEventListener(bindings[i].gesture.getId(), bindings[i].handler, bindings[i].capture);
        unbound.push(bindings.splice(i, 1));
      }

      i--;
    }

    return unbound;
  }

  /*unbind*/

  /**
   * Registers a new gesture with an assigned key
   * @param {String} key - The key used to register an element to that gesture
   * @param {Gesture} gesture - A gesture object
   */
  register(key, gesture) {
    if (typeof key !== 'string') {
      throw new Error('Parameter key is an invalid string');
    }

    if (!gesture instanceof Gesture) {
      throw new Error('Parameter gesture is an invalid Gesture object');
    }

    gesture.setType(key);
    this.state.registerGesture(gesture, key);
  }

  /*register*/

  /**
   * Un-registers a gesture from the Region's state such that it is no longer emittable.
   * Unbinds all events that were registered with the type.
   * @param {String|Object} key - Gesture key that was used to register the object
   * @returns {Object} - The Gesture object that was unregistered or null if it could not be found.
   */
  unregister(key) {
    for (var i = 0; i < this.state.bindings.length; i++) {
      var binding = this.state.bindings[i];
      if (binding.gesture.getType() === key) {
        binding.element.removeEventListener(binding.gesture.getId(),
          binding.handler, binding.capture);
      }
    }

    var registeredGesture = this.state.registeredGestures[key];
    delete this.state.registeredGestures[key];
    return registeredGesture;
  }
}

export default Region;
