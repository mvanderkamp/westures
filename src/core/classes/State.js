/**
 * @file State.js
 */

const Gesture = require('./Gesture.js');
const Pan     = require('./../../gestures/Pan.js');
const Pinch   = require('./../../gestures/Pinch.js');
const Rotate  = require('./../../gestures/Rotate.js');
const Swipe   = require('./../../gestures/Swipe.js');
const Tap     = require('./../../gestures/Tap.js');
const Binding = require('./Binding.js');
const Input   = require('./Input.js');
const util    = require('./../util.js');

const DEFAULT_MOUSE_ID = 0;

/**
 * Creates an object related to a Region's state,
 * and contains helper methods to update and clean up different states.
 */
class State {
  /**
   * Constructor for the State class.
   * @param {String} regionId - The id the region this state is bound to.
   */
  constructor(regionId) {
    /**
     * The id for the region this state is bound to.
     * @type {String}
     */
    this.regionId = regionId;

    /**
     * An array of current and recently inactive
     *  Input objects related to a gesture.
     * @type {Input}
     */
    this.inputs = [];

    /**
     * An array of Binding objects; The list of relations between elements,
     *   their gestures, and the handlers.
     * @type {Binding}
     */
    this.bindings = [];

    /**
     * The number of gestures that have been registered with this state
     * @type {Number}
     */
    this.numGestures = 0;

    /**
     * A key/value map all the registered gestures for the listener.
     *  Note: Can only have one gesture registered to one key.
     * @type {Object}
     */
    this.registeredGestures = {};

    this.registerGesture(new Pan(), 'pan');
    this.registerGesture(new Rotate(), 'rotate');
    this.registerGesture(new Pinch(), 'pinch');
    this.registerGesture(new Swipe(), 'swipe');
    this.registerGesture(new Tap(), 'tap');
  }

  /**
   * Creates a new binding with the given element and gesture object.
   * If the gesture object provided is unregistered, it's reference
   * will be saved in as a binding to be later referenced.
   * @param  {Element} element - The element the gesture is bound to.
   * @param {String|Object} gesture  - Either a name of a registered gesture,
   *  or an unregistered  Gesture object.
   * @param {Function} handler - The function handler to be called
   *  when the event is emitted. Used to bind/unbind.
   * @param {Boolean} capture - Whether the gesture is to be
   *  detected in the capture of bubble phase. Used to bind/unbind.
   * @param {Boolean} bindOnce - Option to bind once and
   *  only emit the event once.
   */
  addBinding(element, gesture, handler, capture, bindOnce) {
    let boundGesture;

    // Error type checking.
    if (element && typeof element.tagName === 'undefined') {
      throw new Error('Parameter element is an invalid object.');
    }

    if (typeof handler !== 'function') {
      throw new Error('Parameter handler is invalid.');
    }

    if (typeof gesture === 'string' &&
      Object.keys(this.registeredGestures).indexOf(gesture) === -1) {
      throw new Error('Parameter ' + gesture + ' is not a registered gesture');
    } else if (typeof gesture === 'object' && !(gesture instanceof Gesture)) {
      throw new Error('Parameter for the gesture is not of a Gesture type');
    }

    if (typeof gesture === 'string') {
      boundGesture = this.registeredGestures[gesture];
    } else {
      boundGesture = gesture;
      if (boundGesture.id === '') {
        this.assignGestureId(boundGesture);
      }
    }

    this.bindings.push(new Binding(element, boundGesture,
      handler, capture, bindOnce));
    element.addEventListener(boundGesture.getId(), handler, capture);
  }

  getEndedInputs() {
    return this.inputs.filter( input => {
      return input.getCurrentEventType() === 'end';
    });
  }

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param {Element} element - The element to find bindings to.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByElement(element) {
    return this.bindings.filter( b => b.element === element );
  }

  /**
   * Retrieves all bindings based upon the initial X/Y position of the inputs.
   * e.g. if gesture started on the correct target element,
   *  but diverted away into the correct region, this would still be valid.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByInitialPos() {
    return this.bindings.filter( binding => {
      return this.inputs.some( input => {
        return input.wasInitiallyInside(binding.element);
      });
    });
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   * @param {Event} event - The event being captured.
   *  this current Region is bound to.
   * @return {boolean} - returns true for a successful update,
   *  false if the event is invalid.
   */
  updateInputs(event) {
    const update_fns = {
      TouchEvent: (event) => {
        Array.from(event.changedTouches).forEach( touch => {
          this.update(event, touch.identifier);
        });
      },

      PointerEvent: (event) => {
        this.update(event, event.pointerId);
      },

      MouseEvent: (event) => {
        this.update(event, DEFAULT_MOUSE_ID);
      },
    };

    let eventType = event.constructor.name;
    update_fns[eventType].call(this, event);
  }

  update(event, identifier) {
    const input = this.inputs[identifier];
    if (input) {
      input.update(event, identifier);
    } else {
      this.inputs[identifier] = new Input(event, identifier);
    }
  }

  /**
   * Removes all inputs from the state, allowing for a new gesture.
   */
  resetInputs() {
    this.inputs = [];
  }

  /**
   * Filters out any inputs whose current event type is 'end'.
   *
   * @return {Array} The active inputs.
   */
  activeInputs() {
    return this.inputs.filter( i => i && i.getCurrentEventType() !== 'end' );
  }

  /**
   * Counts the number of active inputs at any given time.
   * @return {Number} - The number of active inputs.
   */
  numActiveInputs() {
    const endType = this.inputs.filter((input) => {
      return input.current.type !== 'end';
    });
    return endType.length;
  }

  /**
   * Register the gesture to the current region.
   * @param {Object} gesture - The gesture to register
   * @param {String} key - The key to define the new gesture as.
   */
  registerGesture(gesture, key) {
    this.assignGestureId(gesture);
    this.registeredGestures[key] = gesture;
  }

  /**
   * Tracks the gesture to this state object to become uniquely identifiable.
   * Useful for nested Regions.
   * @param {Gesture} gesture - The gesture to track
   */
  assignGestureId(gesture) {
    gesture.setId(this.regionId + '-' + this.numGestures++);
  }
}

/**
 * Searches through each input, comparing the browser's identifier key
 *  for touches, to the stored one in each input
 * @param {Array} inputs - The array of inputs in state.
 * @param {String} identifier - The identifier the browser has assigned.
 * @return {Input} - The input object with the corresponding identifier,
 *  null if it did not find any.
 */
function findInputById(inputs, identifier) {
  return inputs.find( i => i.identifier === identifier );
}

module.exports = State;
