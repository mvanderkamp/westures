/**
 * @file Pinch.js
 * Contains the abstract Pinch class
 */

const Gesture = require('../core/Gesture.js');
const Point2D = require('../core/Point2D.js');
const util    = require('../core/util.js');

const REQUIRED_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pinch is defined as two inputs moving either together or apart.
 *
 * @class Pinch
 */
class Pinch extends Gesture {
  /**
   * Constructor function for the Pinch class.
   *
   * @param {Object} options
   */
  constructor(options = {}) {
    super('pinch');

    /**
     * The minimum amount in pixels the inputs must move until it is fired.
     *
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Initializes the gesture progress and stores it in the first input for
   * reference events.
   *
   * @param {State} input status object
   */
  initializeProgress(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length < REQUIRED_INPUTS) return null;

    const { midpoint, averageDistance } = getMidpointAndAverageDistance(active);

    // Progress is store on the first active input.
    const progress = active[0].getProgressOfGesture(this.id);
    progress.previousDistance = averageDistance;
  }

  /**
   * Event hook for the start of a gesture. 
   *
   * @param {State} input status object
   */
  start(state) {
    this.initializeProgress(state);
  }

  /**
   * Event hook for the move of a gesture.  Determines if the two points are
   * moved in the expected direction relative to the current distance and the
   * last distance.
   *
   * @param {State} input status object
   *
   * @return {Object | null} - Returns the distance in pixels between two inputs
   */
  move(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length < REQUIRED_INPUTS) return null;

    const { midpoint, averageDistance } = getMidpointAndAverageDistance(active);

    const baseProgress = active[0].getProgressOfGesture(this.id);
    const change = averageDistance - baseProgress.previousDistance;

    if (Math.abs(change) >= this.threshold) {
      // Progress is store on the first active input.
      const progress = active[0].getProgressOfGesture(this.id);
      progress.previousDistance = averageDistance;

      return {
        distance: averageDistance,
        midpoint,
        change,
      };
    }
  }

  /**
   * Event hook for the end of a gesture. 
   *
   * @param {State} input status object
   */
  end(state) {
    this.initializeProgress(state);
  }
}

/**
 * Packs together the midpoint and the average distance to that midpoint of a
 * collection of points, which are gathered from their input objects. These are
 * packed together so that the inputs only have to be mapped to their current
 * points once.
 */
function getMidpointAndAverageDistance(inputs) {
  const points = inputs.map( i => i.current.point );
  const midpoint = Point2D.midpoint(points); 
  const averageDistance = midpoint.averageDistanceTo(points);
  return { midpoint, averageDistance };
}

module.exports = Pinch;

