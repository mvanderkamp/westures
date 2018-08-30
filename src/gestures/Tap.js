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
  start(inputs, state, element) {
    const starting = state.startingInputs();
    starting.forEach( input => {
      const progress = input.getGestureProgress(this.getId());
      progress.start = Date.now();
    });
  }

  /**
   * Event hook for the end of a gesture.
   * Determines if this the tap event can be fired if the delay and tolerance
   * constraints are met. Also waits for all of the inputs to be off the screen
   * before determining if the gesture is triggered.
   *
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   *
   * @return {null|Object} - null if the gesture is not to be emitted,
   * Object with information otherwise. Returns the interval time between start
   * and end events.
   */
  end(inputs, state, element) {
    const now = Date.now();
    const ended = state.endedInputs();
    const timed = ended.filter( i => {
      const progress = i.getGestureProgress(this.getId());
      return (now - progress.start) < this.maxDelay;
    });

    if (timed.length !== this.numInputs) return null;
    if (!areWithinSpatialTolerance(timed, this.tolerance)) return null;

    const sorted = timed.sort( (a,b) => {
      const pa = a.getGestureProgress(this.getId());
      const pb = b.getGestureProgress(this.getId());
      return pa.start - pb.start 
    });
    const interval = now - sorted[0].getGestureProgress(this.getId()).start;

    if (isBetween(interval, this.minDelay, this.maxDelay)) {
      const point = sorted[0].current.point;
      return { 
        interval,
        x: point.x,
        y: point.y,
      };
    } 
    return null;
  }
  /* end*/
}

function areWithinSpatialTolerance(endedInputs, tolerance) {
  return endedInputs.every( i => i.totalDistanceIsWithin(tolerance) );
}

function getTemporalInterval(endedInputs, gestureId) {
  const now = Date.now();

  const startTime = endedInputs.reduce( (earliest, input) => {
    const progress = input.getGestureProgress(gestureId);
    if (progress.start < earliest) earliest = progress.start;
    return earliest;
  }, now);

  return now - startTime;
}

function isBetween(x, low, high) {
  return (x >= low) && (x <= high)
}

module.exports = Tap;
