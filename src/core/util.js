import {state} from './state.js';
import {Gesture} from '../gestures/Gesture.js';

var util = {
  /**
   * =
   * @param {mixed} Either a string or an element.
   * @returns {*} - Returns an element, or null if the parameter was invalid or the element could not be found.
   */
  getElement: function (target) {
    if (target) {
      if (typeof target === 'string') {
        return document.querySelector(target);
      } else if (typeof target.tagName !== 'undefined') {
        return target;
      }
    }

    return null;
  },

  /**
   * Verifies the the specified gesture is a valid binding. Either its a key in Bindings, or
   * @param {mixed} binding - Either a string representing a 'registered' gesture or, a Gesture object.
   * @returns {boolean} - Whether or not the binding is valid.
   */
  isValidBinding: function (binding) {
    return (typeof binding === 'string' && Object.keys(state.bindings).indexOf(binding) > -1) ||
      (binding instanceof Gesture);
  }
};
export {util};
