import state from './state.js';
import Gesture from './../gestures/Gesture.js';

var util = {
  isValidGesture: function (gesture) {
    return (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1) || (gesture instanceof Gesture);
  },

  getGestureType: function (gesture) {
    if (typeof gesture === 'string' && (Object.keys(state.registeredGestures)).indexOf(gesture) > -1) {
      return gesture;
    } else if (gesture instanceof Gesture) {
      return gesture.getType();
    } else {
      return null;
    }
  },
  /**
   * Normalize mouse and other input types to be touch.
   * @param type
   * @returns {*}
   */
  normalizeEvent: function (type) {
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
  }
};
export default util;
