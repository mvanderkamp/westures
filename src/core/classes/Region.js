/**
 * @file Region.js
 */

const Binder  = require('./Binder.js');
const Gesture = require('./Gesture.js');
const arbiter = require('./../arbiter.js');
const State   = require('./State.js');

/**
 * Allows the user to specify a region to capture all events to feed ZingTouch
 * into. This can be as narrow as the element itself, or as big as the document
 * itself. The more specific an area, the better performant the overall
 * application will perform. Contains API methods to bind/unbind specific
 * elements to corresponding gestures. 
 * @class Region
 */
class Region {
  /**
   * Constructor function for the Region class.
   * @param {Element} element - The element to capture all
   *  window events in that region to feed into ZingTouch.
   * @param {boolean} [capture=false] - Whether the region listens for
   *  captures or bubbles.
   * @param {boolean} [preventDefault=true] - Whether the default browser
   *  functionality should be disabled;
   * @param {Number} id - The id of the region, assigned by the ZingTouch object
   */
  constructor(element, capture = false, preventDefault = true, id) {
    /**
     * The identifier for the Region. This is assigned by the ZingTouch object
     * and is used to hash gesture id for uniqueness.
     * @type {Number}
     */
    this.id = id;

    /**
     * The element being bound to.
     * @type {Element}
     */
    this.element = element;

    /**
     * Whether the region listens for captures or bubbles.
     * @type {boolean}
     */
    this.capture = capture;

    /**
     * Boolean to disable browser functionality such as scrolling and zooming
     * over the region
     * @type {boolean}
     */
    this.preventDefault = preventDefault;

    /**
     * The internal state object for a Region.
     * Keeps track of inputs and bindings.
     * @type {State}
     */
    this.state = new State(id);

    let eventNames = [];
    if (window.PointerEvent && !window.TouchEvent) {
      eventNames = [
        'pointerdown',
        'pointermove',
        'pointerup',
      ];
    } else {
      eventNames = [
        'mousedown',
        'mousemove',
        'mouseup',
        'touchstart',
        'touchmove',
        'touchend',
      ];
    }

    // Bind detected browser events to the region element.
    eventNames.forEach((name) => {
      element.addEventListener(name, (e) => {
        arbiter(e, this);
      }, this.capture);
    });
  }

  /**
   * Bind an element to a gesture with multiple function signatures.
   *
   * @example
   * bind(element) - chainable
   *
   * @example
   * bind(element, gesture, handler, [capture])
   *
   * @param {Element} element - The element object.
   * @param {String|Object} [gesture] - Gesture key, or a Gesture object.
   * @param {Function} [handler] - The function to execute when an event is
   * emitted.
   * @param {Boolean} [capture] - capture/bubble
   * @param {Boolean} [bindOnce = false] - Option to bind once and only emit the
   * event once.
   *
   * @return {Object} - a chainable object that has the same function as bind.
   */
  bind(element, gesture, handler, capture, bindOnce) {
    if (!element || (element && !element.tagName)) {
      throw 'Bind must contain an element';
    }

    bindOnce = (typeof bindOnce !== 'undefined') ? bindOnce : false;
    if (!gesture) {
      return new Binder(element, bindOnce, this.state);
    } else {
      this.state.addBinding(element, gesture, handler, capture, bindOnce);
    }
  }

  /**
   * Bind an element and sets up actions to remove the binding once
   * it has been emitted for the first time.
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Element} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an
   *  event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @return {Object} - a chainable object that has the same function as bind.
   */
  bindOnce(element, gesture, handler, capture) {
    this.bind(element, gesture, handler, capture, true);
  }

  /**
   * Unbinds an element from either the specified gesture
   *  or all if no element is specified.
   * @param {Element} element -The element to remove.
   * @param {String | Object} [gesture] - A String representing the gesture,
   *   or the actual object being used.
   * @return {Array} - An array of Bindings that were unbound to the element;
   */
  unbind(element, gesture) {
    let bindings = this.state.retrieveBindingsByElement(element);
    let unbound = [];

    bindings.forEach((binding) => {
      if (gesture) {
        element.removeEventListener(
          binding.gesture.id,
          binding.handler,
          binding.capture);
        unbound.push(binding);
      }
    });

    return unbound;
  }
  /* unbind*/
}

module.exports = Region;
