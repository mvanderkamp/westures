/**
 * @file Pan.js
 * Contains the Pan class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 1;

/**
 * A Pan is defined as a normal movement in any direction on a screen. Pan gestures do not track start events and
 * can interact with pinch and expand gestures.
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   * @param {Number} [numInputs=1] - Number of inputs for the Pan gesture.
   */
  constructor(numInputs) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pan';

    /**
     * The number of inputs to trigger a Pan can be variable, and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;
  }
  /*constructor*/

  /**
   * move() - Event hook for the move of a gesture. Fired whenever the input length is met, and keeps a boolean flag
   * that the gesture has fired at least once.
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {Object} - Returns the distance in pixels between the two inputs.
   */
  move(inputs) {
    if (this.numInputs === inputs.length) {
      var data = {};
      for (var i = 0; i < inputs.length; i++) {
        var progress = inputs[i].getGestureProgress(this.getId());
        progress.active = true;
        data[i] = {
          distance: util.distanceBetweenTwoPoints(inputs[i].initial.x, inputs[i].current.x, inputs[i].initial.y, inputs[i].current.y)
        };
      }
    }

    return data;
  }
  /*move*/

  /**
   * end() - Event hook for the end of a gesture. If the gesture has at least fired once, then it ends on the first end event such that
   * any remaining inputs will not trigger the event until all inputs have reached the touchend event.
   * Any touchend->touchstart events that occur before all inputs are fully off the screen should not fire.
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - null if the gesture is not to be emitted, Object with information otherwise.
   */
  end(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      var progress = inputs[i].getGestureProgress(this.getId());
      if (progress.active) {
        state.resetInputs();
        break;
      }
    }

    return null;
  }
  /*end*/
}

export default Pan;
