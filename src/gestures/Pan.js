/**
 * @file Pan.js
 * Contains the Pan class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 1;

/**
 * Gesture object detailing Pan functionality.
 * @class Pan
 * @extends Gesture
 */
class Pan extends Gesture {
  constructor(numInputs) {
    super();
    this.type = 'pan';
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;
  }

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {Object} - Tap does not trigger
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
   * end() - Event hook for the end of a gesture. This assumes that no other event can be started until all inputs are off of the screen.
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
