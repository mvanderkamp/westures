/**
 * @file Press.js
 * Contains the Press class
 */

import Tap from './Tap.js';
import util from './../core/util.js';

const DEFAULT_MIN_DELAY_MS = 800;
const DEFAULT_INPUTS = 1;
const DEFAULT_MOVE_PX_TOLERANCE = 10;

/**
 * A Press is defined as a touchstart to touchend event with a long pause in between.
 * @class Tap
 */
class Press extends Tap {
  /**
   * Constructor function for the Press class.
   * @param {Object} options - The options object.
   * @param {Number} [options.minDelay=800] - The minimum delay between a touchstart and
   * touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for the Press gesture.
   * @param {Number} [options.moveTolerance=10] - The tolerance in pixels a user can move.
   */
  constructor(options) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'press';

    /**
     * The maximum delay between a touchstart and touchend can be configured in milliseconds.
     * The maximum delay starts to count down when the expected number of inputs are on
     * the screen, and ends when ALL inputs are off the screen.
     * @type {Number}
     */
    this.minDelay = (options && options.minDelay) ? options.minDelay : DEFAULT_MIN_DELAY_MS;

    /**
     * The number of inputs to trigger a Press can be variable, and the maximum number being
     * a factor of the browser.
     * @type {Number}
     */
    this.numInputs = (options && options.numInputs) ? options.numInputs : DEFAULT_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end events. This
     * allows the Press gesture to be triggered more easily.
     * @type {number}
     */
    this.moveTolerance = (options && options.moveTolerance) ? options.moveTolerance : DEFAULT_MOVE_PX_TOLERANCE;
  }
  /*constructor*/

  /**
   * Event hook for the end of a gesture.
   * Determines if this press tap event can be fired if the delay and moveTolerance
   * constraints are met. Also waits for all of the inputs to be off the screen before determining
   * if the gesture is triggered.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @returns {null|Object} - null if the gesture is not to be emitted, Object with information
   * otherwise.
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
    if (this.minDelay <= interval) {
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

export default Press;
