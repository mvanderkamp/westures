/**
 * @file Distance.js
 * Contains the abstract Distance class
 */

import Gesture from './Gesture.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Distance is defined as two inputs moving either together or apart.
 * @class Distance
 */
class Distance extends Gesture {
  /**
   * Constructor function for the Distance class.
   * @param {Object} options
   */
  constructor(options) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'distance';

    /**
     * The minimum amount in pixels the inputs must move until it is fired.
     * @type {Number}
     */
    this.threshold = (options && options.threshold) ?
      options.threshold : DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Event hook for the start of a gesture. Initialized the lastEmitted
   * gesture and stores it in the first input for reference events.
   * @param {Array} inputs
   */
  start(inputs, state, element) {
  if(!this.isValid(inputs, state, element)) {
    return null;
  }
    if (inputs.length === DEFAULT_INPUTS) {
      // Store the progress in the first input.
      let progress = inputs[0].getGestureProgress(this.type);
      progress.lastEmittedDistance = util.distanceBetweenTwoPoints(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);
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
    if (state.numActiveInputs() === DEFAULT_INPUTS) {
      let currentDistance = util.distanceBetweenTwoPoints(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);
      let lastDistance = util.distanceBetweenTwoPoints(
        inputs[0].previous.x,
        inputs[1].previous.x,
        inputs[0].previous.y,
        inputs[1].previous.y);

      const centerPoint = util.getMidpoint(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);

      // Retrieve the first input's progress.
      let progress = inputs[0].getGestureProgress(this.type);

      if (this.constructor.name === 'Expand') {
        if (currentDistance < lastDistance) {
          progress.lastEmittedDistance = currentDistance;
        } else if ((currentDistance - progress.lastEmittedDistance >=
          this.threshold)) {
          progress.lastEmittedDistance = currentDistance;
          return {
            distance: currentDistance,
            center: centerPoint,
          };
        }
      } else {
        if (currentDistance > lastDistance) {
          progress.lastEmittedDistance = currentDistance;
        } else if (currentDistance < lastDistance &&
          (progress.lastEmittedDistance - currentDistance >= this.threshold)) {
          progress.lastEmittedDistance = currentDistance;
          return {
            distance: currentDistance,
            center: centerPoint,
          };
        }
      }

      return null;
    }
  }
}

export default Distance;
