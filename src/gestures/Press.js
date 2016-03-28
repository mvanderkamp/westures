/**
 * @file Press.js
 * Contains the Press class
 */

import Tap from './Tap.js';
import util from './../core/util.js';

const DEFAULT_MIN_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 5000;

/**
 * A Press is defined as a touchstart to touchend event with a long pause in between.
 * @class Tap
 */
class Press extends Tap {
  /**
   * Constructor function for the Press class.
   * @param {Object} options - The options object.
   * @param {Number} [options.minDelay=500] - The minimum delay between a touchstart and
   * touchend can be configured in milliseconds.
   * @param {Number} [options.maxDelay=5000] - The minimum delay between a touchstart and
   * touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for the Press gesture.
   * @param {Number} [options.moveTolerance=10] - The tolerance in pixels a user can move.
   */
  constructor(options) {
    super(options);

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'press';

    /**
     * The minimum amount between a touchstart and a touchend can be configured in milliseconds.
     * The minimum delay starts to count down when the expected number of inputs are on
     * the screen, and ends when ALL inputs are off the screen.
     * @type {Number}
     */
    this.minDelay = (options && options.minDelay) ? options.minDelay : DEFAULT_MIN_DELAY_MS;

    /**
     * The maximum amount between a touchstart and a touchend can be configured in milliseconds.
     * The maximum delay starts to count down when the expected number of inputs are on
     * the screen, and ends when ALL inputs are off the screen.
     * @type {Number}
     */
    this.maxDelay = (options && options.maxDelay) ? options.maxDelay : DEFAULT_MAX_DELAY_MS;

  }
  /*constructor*/
}

export default Press;
