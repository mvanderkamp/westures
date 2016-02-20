import state from './state.js';
import Gesture from './../gestures/Gesture.js';

var util = {
  /**
   *
   * @param gesture - Either a string representing a binding, or a the Gesture itself.
   * @returns {*}
   */
  getGestureType: function (gesture) {
    if (typeof gesture === 'string' && Object.keys(state.bindings).indexOf(gesture) > -1) {
      return gesture;
    } else if (gesture instanceof Gesture) {
      return gesture.getType();
    } else {
      return null;
    }
  }

};
export default util;
