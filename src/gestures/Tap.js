/**
 * @file Tap.js
 * Contains the Tap class
 */

import Gesture from './Gesture.js';

const DEFAULT_DELAY_MS = 300;
const DEFAULT_INPUTS = 1;

/**
 * Gesture object detailing Tap functionality.
 * @class Tap
 * @extends Gesture
 */
class Tap extends Gesture {
  constructor(maxDelay, numInputs) {
    super();
    this.type = 'tap';
    this.maxDelay = (maxDelay) ? maxDelay : DEFAULT_DELAY_MS;
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;
  }

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Tap does not trigger
   */
  start(inputs) {

    if (inputs.length === this.numInputs) {
      var progress = inputs[0].getGestureProgress(this.type);
      progress.start = new Date().getTime();
    }

    return null;
  }/*start*/

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Tap does not trigger
   */
  move(inputs) {
    inputs[0].resetProgress(this.type);
    return null;
  }/*move*/

  /**
   * end() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null|Object} - null if the gesture is not to be emitted, Object with information otherwise.
   */
  end(inputs) {
    if (inputs.length > this.numInputs) {
      return null;
    }

    var progress = inputs[0].getGestureProgress(this.type);
    if (Object.keys(progress).length !== 0) {
      var interval = new Date().getTime() - progress.start;
      if (this.maxDelay >= interval) {
        return {
          interval: interval
        };
      } else {
        inputs[0].resetProgress(this.type);
      }
    }

    return null;

  }/*end*/

}

export default Tap;
