/**
 * @file Tap.js
 * Contains the Tap class
 */

import Gesture from './Gesture.js';
import util from './../core/util.js';

const DEFAULT_DELAY_MS = 300;
const DEFAULT_INPUTS = 1;
const DEFAULT_MOVE_PX_TOLERANCE = 10;

/**
 * Gesture object detailing Tap functionality.
 * @class Tap
 * @extends Gesture
 */
class Tap extends Gesture {
  constructor(maxDelay, numInputs, moveTolerance) {
    super();
    this.type = 'tap';
    this.maxDelay = (maxDelay) ? maxDelay : DEFAULT_DELAY_MS;
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;
    this.moveTolerance = (moveTolerance) ? moveTolerance : DEFAULT_MOVE_PX_TOLERANCE;
  }

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Tap does not trigger
   */
  start(inputs) {

    if (inputs.length === this.numInputs) {
      for (var i = 0; i < inputs.length; i++) {
        var progress = inputs[i].getGestureProgress(this.type);
        progress.start = new Date().getTime();
      }
    }

    return null;
  }
  /*start*/

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Tap does not trigger
   */
  move(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() === 'move') {
        var current = inputs[i].current;
        var last = inputs[i].last;
        if (!util.isWithin(current.x, current.y, last.x, last.y, this.moveTolerance)) {
          var type = this.type;
          inputs.forEach(function (input) {
            input.resetProgress(type);
          });
        }
      }
    }

    return null;
  }
  /*move*/

  /**
   * end() - Event hook for the end of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null|Object} - null if the gesture is not to be emitted, Object with information otherwise.
   */
  end(inputs) {
    if (inputs.length !== this.numInputs) {
      return null;
    }

    var startTime = Number.MAX_VALUE;
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() !== 'end') {
        return null;
      }

      var progress = inputs[i].getGestureProgress(this.type);
      if (!progress.start) {
        return null;
      }

      if (progress.start < startTime) {
        startTime = progress.start;
      }
    }

    var interval = new Date().getTime() - startTime;
    if (this.maxDelay >= interval) {
      return {
        interval: interval
      };
    } else {
      let type = this.type;
      inputs.forEach(function (input) {
        input.resetProgress(type);
      });

      return null;
    }
  }
  /*end*/
}

export default Tap;
