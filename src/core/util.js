/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

import state from './state.js';
import Gesture from './../gestures/Gesture.js';

var util = {

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
