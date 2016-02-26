/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

import state from './state.js';
import Gesture from './../gestures/Gesture.js';

var util = {
  /**
   * Determines whether the string is a registered gesture or the object is of type Gesture.
   * @param {string|Object} gesture - Either the gesture or gesture's key
   * @returns {boolean} - true if a valid gesture
   */
  isValidGesture(gesture) {
    return (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1)
      || (gesture instanceof Gesture);
  },/*isValidGesture*/

  /**
   * Returns the key value of the gesture provided.
   * @param {Object} gesture - A Gesture object
   * @returns {null|String} - returns the key value of the valid gesture, null otherwise.
   */
  getGestureType(gesture) {
    if (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1) {
      return gesture;
    } else if (gesture instanceof Gesture) {
      return gesture.getType();
    } else {
      return null;
    }
  },/*getGestureType*/

  /**
   * Normalizes window events to be either of type start, move, or end.
   * @param {String} type - The event type emitted by the browser
   * @returns {null|String} - The normalized event, or null if it is an event not predetermined.
   */
  normalizeEvent(type) {
    switch (type) {
      case 'mousedown' :
      case 'touchstart' :
        return 'start';
        break;
      case 'mousemove' :
      case 'touchmove' :
        return 'move';
        break;
      case 'mouseup' :
      case 'touchend' :
        return 'end';
        break;
      default :
        return null;
    }
  }/*normalizeEvent*/
};
export default util;
