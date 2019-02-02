/**
 * Contains the abstract Pinch class.
 */

'use strict';

const { Gesture } = require('westures-core');

const DEFAULT_MIN_INPUTS = 2;

/**
 * @typedef PinchData
 * @type {Object}
 * @property {Number} distance - The average distance from an active input to
 *    the centroid.
 * @property {Number} change - The change in distance since last emit.
 * @property {Point2D} midpoint - The centroid of the currently active points.
 * @property {Number} midpoint.x - x coordinate of centroid.
 * @property {Number} midpoint.y - y coordinate of centroid.
 */

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 * @see PinchData
 */
class Pinch extends Gesture {
  /**
   * Constructor function for the Pinch class.
   *
   * @param {Object} [options]
   * @param {Number} [options.minInputs=2] The minimum number of inputs that
   *    must be active for a Pinch to be recognized.
   */
  constructor(options = {}) {
    super('pinch');

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
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  initializeProgress(state) {
    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.previousDistance = distance;
  }

  /**
   * Event hook for the start of a Pinch.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }

  /**
   * Event hook for the move of a Pinch.
   *
   * @param {State} state - current input state.
   * @return {?PinchData} - null if not recognized.
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
   * Event hook for the end of a Pinch.
   *
   * @private
   * @param {State} input status object
   * @return {undefined}
   */
  end(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }
}

module.exports = Pinch;

