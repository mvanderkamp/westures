/**
 * @file state.js
 * Contains information about state in ZingTouch and is responsible for updates based of events
 */

import Binding from './classes/Binding.js';
import Input from './classes/Input.js';
import Tap from './../gestures/Tap.js';
import Gesture from './../gestures/Gesture.js';
import util from './util.js';

/**
 *  Contains the state of each Input, bound elements, and a list of registered gestures
 */
var state = {
  inputs: [],
  bindings: [],
  numGestures: 0,

  //Functions with keys to be iterated and used in the interpreter.
  registeredGestures: {
    tap: new Tap()
  },

  /**
   * Creates a new binding with the given element and gesture object. If the gesture object provided is
   * unregistered, it's reference will be saved in as a binding.
   * @param element {object} - The element the gesture is bound to.
   * @param gesture {string/object} - Either a name of a registered gesture, or an unregistered Gesture object.
   * @param handler
   * @param capture
   * @returns {null|Binding} - null if the gesture could not be found, the new Binding otherwise
   */
  addBinding: function (element, gesture, handler, capture) {
    if (typeof gesture === 'string') {
      gesture = this.registeredGestures[gesture];
      if (typeof gesture === 'undefined') {
        return null;
      }
    } else if (!(gesture instanceof Gesture)) {
      return null;
    } else {
      gesture.setId(this.numGestures++);
    }

    if (gesture instanceof Gesture) {
      var binding = new Binding(element, gesture, handler, capture);
      this.bindings.push(binding);
      element.addEventListener(gesture.getId(), handler, capture);
      return binding;
    }

  },
  /*addBinding*/

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param element
   * @returns {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindings: function (element) {
    var matches = [];
    for (var i = 0; i < this.bindings.length; i++) {
      if (this.bindings[i].element === element) {
        matches.push(this.bindings[i]);
      }
    }

    return matches;
  },
  /*retrieveBindings*/

  /**
   * Updates the inputs based on the current event.
   * Creates new Inputs if none exist, or more inputs were received.
   * @param {Event} event -The event object
   * @param {Object} event.touches - The TouchList representing the list of  all contact points
   * @param {Object} event.targetTouches - The TouchList representing the list of points whose
   * touchstart occurred in the same target element as the same event.
   * @param {Object} event.changedTouches - The TouchList representing points that participated in the event
   * @returns {boolean} - Returns true if the update was successful, false if the event cancelled the current gesture
   */
  updateInputs: function (event) {
    //Return if all gestures did not originate from the same target
    if (event.touches && event.touches.length !== event.targetTouches.length) {
      console.log('not on the same target');
      state.resetInputs();
      return false;
    }

    if (event.touches) {
      for (var index in event.changedTouches) {
        if (event.changedTouches.hasOwnProperty(index) && Number.isInteger(parseInt(index))) {
          var id = event.changedTouches[index].identifier;
          if (util.normalizeEvent(event.type) === 'start') {
            if (this.inputs[id]) {
              //This should restart the inputs and cancel out any gesture.
              this.resetInputs();
              return false;
            } else {
              this.inputs.push(new Input(event, id));
            }
          } else {
            if (this.inputs[id]) {
              this.inputs[id].update(event, id);
            }
          }
        }
      }
    } else {
      if (util.normalizeEvent(event.type) === 'start') {
        this.inputs.push(new Input(event));
      } else {
        this.inputs[0].update(event);
      }
    }

    return true;
  },
  /*updateInputs*/

  /**
   * Removes all inputs from the state, allowing for a new gesture.
   */
  resetInputs: function () {
    this.inputs = [];
  }
  /*resetInputs*/
};

/**
 * Returns the key value of the gesture provided.
 * @param {Object} gesture - A Gesture object
 * @returns {null|String} - returns the key value of the valid gesture, null otherwise.
 */
function getGestureType(gesture) {
  if (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1) {
    return gesture;
  } else if (gesture instanceof Gesture) {
    return gesture.getType();
  } else {
    return null;
  }
}
/*getGestureType*/

export {state as default, state, getGestureType};
