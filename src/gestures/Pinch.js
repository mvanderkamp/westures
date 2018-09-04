/**
 * @file Pinch.js
 * Contains the abstract Pinch class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pinch is defined as two inputs moving either together or apart.
 * @class Pinch
 */
class Pinch extends Gesture {
  /**
   * Constructor function for the Pinch class.
   * @param {Object} options
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pinch';

    /**
     * The minimum amount in pixels the inputs must move until it is fired.
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Event hook for the start of a gesture. Initialized the lastEmitted
   * gesture and stores it in the first input for reference events.
   * @param {Array} inputs
   */
  start(inputs, state, element) {
    const active = state.activeInputs();

    if (!this.isValid(active, state, element)) return null;
    
    if (active.length === DEFAULT_INPUTS) {
      // Store the progress in the first input.
      const progress = active[0].getProgressOfGesture(this.getId());
      progress.lastEmittedDistance = active[0].currentDistanceTo(active[1]);
    }
  }

  /**
   * Event hook for the move of a gesture.
   *  Determines if the two points are moved in the expected direction relative
   *  to the current distance and the last distance.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {Object | null} - Returns the distance in pixels between two inputs
   */
  move(inputs, state, element) {
    const active = state.activeInputs();

    if (active.length === DEFAULT_INPUTS) {
      const currentDistance = active[0].currentDistanceTo(active[1]);
      const centerPoint = active[0].currentMidpointTo(active[1]);

      // Progress is stored in the first input.
      const progress = active[0].getProgressOfGesture(this.getId());
      const change = currentDistance - progress.lastEmittedDistance;

      if (Math.abs(change) >= this.threshold) {
        progress.lastEmittedDistance = currentDistance;
        return {
          distance: currentDistance,
          center: centerPoint,
          change: change,
        };
      }
    }

    return null;
  }
}

module.exports = Pinch;
