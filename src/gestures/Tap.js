/**
 * @file Tap.js
 * Contains the Tap class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_MIN_DELAY_MS = 0;
const DEFAULT_MAX_DELAY_MS = 300;
const DEFAULT_INPUTS = 1;
const DEFAULT_MOVE_PX_TOLERANCE = 10;

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 * @class Tap
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   * @param {Object} [options] - The options object.
   * @param {Number} [options.minDelay=0] - The minimum delay between a
   * touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.maxDelay=300] - The maximum delay between a
   * touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {Number} [options.tolerance=10] - The tolerance in pixels
   *  a user can move.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'tap';

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds. The minimum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     * @type {Number}
     */
    this.minDelay = options.minDelay || DEFAULT_MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     * @type {Number}
     */
    this.maxDelay = options.maxDelay || DEFAULT_MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable,
     * and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     * @type {number}
     */
    this.tolerance = options.tolerance || DEFAULT_MOVE_PX_TOLERANCE;
  }

  /* constructor*/

  /**
   * Event hook for the start of a gesture. Keeps track of when the inputs
   * trigger the start event.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @return {null} - Tap does not trigger on a start event.
   */
  start(inputs) {
    if (inputs.length === this.numInputs) {
      inputs.forEach((input) => {
        const progress = input.getGestureProgress(this.type);
        progress.start = new Date().getTime();
      });
    }

    return null;
  }

  /* start*/

  /**
   * Event hook for the move of a gesture. The Tap event reaches here if the
   * user starts to move their input before an 'end' event is reached.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null} - Tap does not trigger on a move event.
   */
  move(inputs, state, element) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() === 'move') {
        const current = inputs[i].current;
        const previous = inputs[i].previous;
        if (!util.isWithin(
            current.x,
            current.y,
            previous.x,
            previous.y,
            this.tolerance)) {
          const type = this.type;
          inputs.forEach(function(input) {
            input.resetProgress(type);
          });

          return null;
        }
      }
    }

    return null;
  }

  /* move*/

  /**
   * Event hook for the end of a gesture.
   * Determines if this the tap event can be fired if the delay and tolerance
   * constraints are met. Also waits for all of the inputs to be off the screen
   * before determining if the gesture is triggered.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @return {null|Object} - null if the gesture is not to be emitted,
   * Object with information otherwise. Returns the interval time between start
   * and end events.
   */
  end(inputs) {
    if (inputs.length !== this.numInputs) {
      return null;
    }

    const startTime = Number.MAX_VALUE;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() !== 'end') {
        return null;
      }

      const progress = inputs[i].getGestureProgress(this.type);
      if (!progress.start) {
        return null;
      }

      // Find the most recent input's startTime
      if (progress.start < startTime) {
        startTime = progress.start;
      }
    }

    const interval = new Date().getTime() - startTime;
    if ((this.minDelay <= interval) && (this.maxDelay >= interval)) {
      return {
        interval: interval,
      };
    } else {
      const type = this.type;
      inputs.forEach(function(input) {
        input.resetProgress(type);
      });

      return null;
    }
  }

  /* end*/
}

module.exports = Tap;
