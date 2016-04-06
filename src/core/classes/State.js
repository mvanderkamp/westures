/**
 * @file State.js
 */

import Gesture from './../../gestures/Gesture.js';
import Expand from './../../gestures/Expand.js';
import Pan from './../../gestures/Pan.js';
import Pinch from './../../gestures/Pinch.js';
import Rotate from './../../gestures/Rotate.js';
import Swipe from './../../gestures/Swipe.js';
import Tap from './../../gestures/Tap.js';
import Binding from './Binding.js';
import Input from './Input.js';
import util from './../util.js';

/**
 * Creates an object related to a Region's state, and contains helper methods to update and clean up different
 * states.
 */
class State {

  /**
   * Constructor for the State class.
   */
  constructor(regionId) {

    /**
     * The id for the region this state is bound to.
     * @type {String}
     */
    this.regionId = regionId;

    /**
     * An array of current and recently inactive Input objects related to a gesture.
     * @type {Input}
     */
    this.inputs = [];

    /**
     * An array of Binding objects; relations between elements, their gestures, and the handlers.
     * @type {Binding}
     */
    this.bindings = [];

    /**
     * The number of gestures that are used with this state
     * @type {Number}
     */
    this.numGestures = 0;

    /**
     * A key/value map all the registered gestures for the listener. Note: Can only have one gesture registered to one key.
     * @type {Object}
     */
    this.registeredGestures = {};

    this.registerGesture(new Expand(), 'expand');
    this.registerGesture(new Pan(), 'pan');
    this.registerGesture(new Rotate(), 'rotate');
    this.registerGesture(new Pinch(), 'pinch');
    this.registerGesture(new Swipe(), 'swipe');
    this.registerGesture(new Tap(), 'tap');
  }

  /**
   * Creates a new binding with the given element and gesture object.
   * If the gesture object provided is unregistered, it's reference will be saved in as a binding to
   * be later referenced.
   * @param  {Element} element - The element the gesture is bound to.
   * @param {String|Object} gesture  - Either a name of a registered gesture, or an unregistered
   *  Gesture object.
   * @param {Function} handler - The function handler to be called when the event is emitted.
   * Used to bind/unbind.
   * @param {Boolean} capture - Whether the gesture is to be detected in the capture of bubble
   * phase. Used to bind/unbind.
   * @param {Boolean} bindOnce - Option to bind once and only emit the event once.
   * @returns {null|Binding} - null if the gesture could not be found, the new Binding otherwise
   */
  addBinding(element, gesture, handler, capture, bindOnce) {
    if (typeof gesture === 'string') {
      gesture = this.registeredGestures[gesture];
      if (typeof gesture === 'undefined') {
        return null;
      }
    } else if (!(gesture instanceof Gesture)) {
      return null;
    } else {
      this.trackGesture(gesture);
    }

    if (gesture instanceof Gesture) {
      var binding = new Binding(element, gesture, handler, capture, bindOnce);
      this.bindings.push(binding);
      element.addEventListener(gesture.getId(), handler, capture);
      return binding;
    }
  }

  /*addBinding*/

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param {Element} element - The element to find bindings to.
   * @returns {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByElement(element) {
    var matches = [];
    for (var i = 0; i < this.bindings.length; i++) {
      if (this.bindings[i].element === element) {
        matches.push(this.bindings[i]);
      }
    }

    return matches;
  }

  /*retrieveBindingsByElement*/

  /**
   * Retrieves all bindings based upon the initial X/Y position of the inputs.
   * e.g. if gesture started on the correct target element, but diverted away into the correct region,
   * this would still be valid.
   * @returns {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByCoord() {

    var matches = [];
    for (var i = 0; i < this.bindings.length; i++) {

      //Determine if at least one input is in the target element. They should all be in
      //the region based upon a prior check
      var insideCount = 0;
      for (var k = 0; k < this.inputs.length; k++) {
        insideCount = (util.isInside(this.inputs[k].initial.x, this.inputs[k].initial.y, this.bindings[i].element)) ? (insideCount + 1) : (insideCount - 1);
      }

      if (insideCount > 0) {
        matches.push(this.bindings[i]);
      }
    }

    return matches;
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   * @param {Event} event - The event being captured
   * @param {Element} regionElement - The element where this current Region is bound to.
   * @returns {boolean} - returns true for a successful update, false if the event is invalid.
   */
  updateInputs(event, regionElement) {
    var identifier = 0;
    var eventType = (event.touches) ? 'TouchEvent' : (event.pointerType) ? 'PointerEvent' : 'MouseEvent';

    switch (eventType) {
      case 'TouchEvent':

        //Return if all gestures did not originate from the same target
        if (event.touches.length !== event.targetTouches.length) {
          this.resetInputs();
          return false;
        }

        for (var index in event.changedTouches) {
          if (event.changedTouches.hasOwnProperty(index) && util.isInteger((parseInt(index)))) {
            identifier = event.changedTouches[index].identifier;
            update(event, this, identifier, regionElement);
          }
        }

        break;

      case 'PointerEvent':
        identifier = event.pointerId;
        update(event, this, identifier, regionElement);
        break;

      case 'MouseEvent':
      default:
        update(event, this, 0, regionElement);
        break;
    }

    function update(event, state, identifier, regionElement) {
      if (util.normalizeEvent(event.type) === 'start') {
        if (findInputById(state.inputs, identifier)) {
          //This should restart the inputs and cancel out any gesture: Tracks inputs that should be active, but lost focus
          state.resetInputs();
          return false;
        } else {
          state.inputs.push(new Input(event, identifier));
        }
      } else {
        var input = findInputById(state.inputs, identifier);
        if (input) {
          //An input has moved outside the region.
          if (!util.isInside(input.current.x, input.current.y, regionElement)) {
            state.resetInputs();
            return false;
          } else {
            input.update(event, identifier);
          }
        }
      }
    }

    return true;
  }

  /*updateInputs*/

  /**
   * Removes all inputs from the state, allowing for a new gesture.
   */
  resetInputs() {
    this.inputs = [];
  }

  /*resetInputs*/

  /**
   * Counts the number of active inputs at any given time.
   * @returns {Number} - The number of active inputs.
   */
  numActiveInputs() {
    var count = 0;
    for (var i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].current.type !== 'end') {
        count++;
      }
    }

    return count;
  }

  /*numActiveInputs*/

  /**
   * Register the gesture to the current region.
   * @param {Gesture} gesture - The gesture to register
   * @param {String} key - The key to define the new gesture as.
   */
  registerGesture(gesture, key) {
    this.trackGesture(gesture);
    this.registeredGestures[key] = gesture;
  }

  /**
   * Tracks the gesture to this state object to become uniquely identifiable.
   * Useful for nested Regions.
   * @param {Gesture} gesture - The gesture to track
   */
  trackGesture(gesture) {
    gesture.setId(this.regionId + '-' + this.numGestures++);
  }

  /*registerGesture*/

}
/**
 * Searches through each input, comparing the browser's identifier key for touches, to the stored one
 * in each input
 * @param {Array} inputs - The array of inputs in state.
 * @param {String} identifier - The identifier the browser has assigned.
 * @returns {Input} - The input object with the corresponding identifier, null if it did not find any.
 */
function findInputById(inputs, identifier) {
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].identifier === identifier) {
      return inputs[i];
    }
  }

  return null;
}
/*findInputById*/

export default State;
