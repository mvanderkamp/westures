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
 * A Tap is defined as a touchstart to touchend event in quick succession.
 * @class Tap
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   * @param {Number} [maxDelay=300] - The maximum delay between a touchstart and touchend can be configured in milliseconds.
   * @param {Number} [numInputs=1] - Number of inputs for the Tap gesture.
   * @param {Number} [moveTolerance=10] - The tolerance in pixels a user can move.
   */
  constructor(maxDelay, numInputs, moveTolerance) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'tap';

    /**
     * The maximum delay between a touchstart and touchend can be configured in milliseconds.
     * The maximum delay starts to count down when the expected number of inputs are on the screen, and ends when ALL inputs are off the screen.
     * @type {Number}
     */
    this.maxDelay = (maxDelay) ? maxDelay : DEFAULT_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end events. This allows the Tap
     * gesture to be triggered more easily.
     * @type {number}
     */
    this.moveTolerance = (moveTolerance) ? moveTolerance : DEFAULT_MOVE_PX_TOLERANCE;
  }
  /*constructor*/

  /**
   * Event hook for the start of a gesture. Keeps track of when the inputs trigger the start event.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @returns {null} - Tap does not trigger on a start event.
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
   * Event hook for the move of a gesture. The Tap event reaches here if the user starts to move their input
   * before an 'end' event is reached.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @returns {null} - Tap does not trigger on a move event.
   */
  move(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() === 'move') {
        var current = inputs[i].current;
        var previous = inputs[i].previous;
        if (!util.isWithin(current.x, current.y, previous.x, previous.y, this.moveTolerance)) {
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
   * Event hook for the end of a gesture.
   * Determines if this the tap event can be fired if the delay and moveTolerance constraints are met. Also waits for
   * all of the inputs to be off the screen before determining if the gesture is triggered.
   * @param {Array} inputs - The array of Inputs on the screen.
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
