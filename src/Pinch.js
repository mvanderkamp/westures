/**
 * @file Pinch.js
 * Contains the abstract Pinch class
 */

const { Gesture, Point2D } = require('westures-core');

const DEFAULT_MIN_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
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

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @type {Number}
     */
    this.minInputs = options.minInputs || DEFAULT_MIN_INPUTS;
  }

  /**
   * Initializes the gesture progress and stores it in the first input for
   * reference events.
   *
   * @param {State} input status object
   */
  initializeProgress(state) {
    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.previousDistance = distance;
  }

  /**
   * Event hook for the start of a gesture. 
   *
   * @param {State} input status object
   */
  start(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }

  /**
   * Event hook for the move of a gesture.
   *
   * @param {State} input status object
   *
   * @return {Object | null} - Returns the distance in pixels between inputs
   */
  move(state) {
    if (state.active.length < this.minInputs) return null;

    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const progress = state.active[0].getProgressOfGesture(this.id);
    const change = distance / progress.previousDistance;
    progress.previousDistance = distance;

    return {
      distance,
      midpoint: state.centroid,
      change,
    };
  }

  /**
   * Event hook for the end of a gesture. 
   *
   * @param {State} input status object
   */
  end(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }
}

/**
 * Packs together the midpoint and the average distance to that midpoint of a
 * collection of points, which are gathered from their input objects. These are
 * packed together so that the inputs only have to be mapped to their current
 * points once.
 */
// function getMidpointAndAverageDistance(inputs) {
  // const points = inputs.map( i => i.current.point );
  // const midpoint = Point2D.midpoint(points); 
  // const averageDistance = midpoint.averageDistanceTo(points);
  // return { midpoint, averageDistance };
// }

module.exports = Pinch;

