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
    }

    var binding = new Binding(element, gesture, handler, capture);
    this.bindings.push(binding);
    element.addEventListener(getGestureType(gesture), handler, capture);
    return binding;
  },

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

  /**
   * Updates the inputs based on the current event.
   * Creates new Inputs if none exist, or more inputs were received.
   * @returns array all updated inputs.
   */
  updateInputs: function (ev) {
    if (ev.touches) {
      for (var index in ev.touches) {
        if (ev.touches.hasOwnProperty(index) && Number.isInteger(parseInt(index))) {
          if (util.normalizeEvent(ev.type) === 'start') {
            this.inputs.push(new Input(ev, index));
          } else {
            this.inputs[index].update(ev, index);
          }
        }
      }
    } else {
      if (util.normalizeEvent(ev.type) === 'start') {
        this.inputs.push(new Input(ev));
      } else {
        this.inputs[0].update(ev);
      }
    }

    return this.inputs;
  }
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
