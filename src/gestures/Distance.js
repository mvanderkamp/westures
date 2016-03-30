/**
 * @file Distance.js
 * Contains the abstract Distance class
 */

import Gesture from './Gesture.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;
const DEFAULT_DIRECTION = 'apart';

/**
 * A Distance is defined as two inputs moving either together or apart.
 * @class Distance
 */
class Distance extends Gesture {
  /**
   * Constructor function for the Distance class.
   */
  constructor(options) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'distance';
    this.threshold = (options && options.threshold) ? options.threshold : DEFAULT_MIN_THRESHOLD;
    this.direction = (options && options.direction) ? options.direction : DEFAULT_DIRECTION;
  }

  start(inputs) {

    if (inputs.length === DEFAULT_INPUTS) {
      //Store the progress in the first input.
      var progress = inputs[0].getGestureProgress(this.type);
      progress.lastEmittedDistance = util.distanceBetweenTwoPoints(inputs[0].current.x, inputs[1].current.x,
        inputs[0].current.y, inputs[1].current.y);
    }
  }

  /**
   * Event hook for the move of a gesture. Determines if the two points are moved in the expected
   * direction relative to the current distance and the last distance.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @returns {Object | null} - Returns the distance in pixels between the two inputs.
   */
  move(inputs) {
    if (inputs.length === DEFAULT_INPUTS) {
      var currentDistance = util.distanceBetweenTwoPoints(inputs[0].current.x, inputs[1].current.x,
        inputs[0].current.y, inputs[1].current.y);
      var lastDistance = util.distanceBetweenTwoPoints(inputs[0].previous.x, inputs[1].previous.x,
        inputs[0].previous.y, inputs[1].previous.y);

      //Retrieve the first input's progress.
      var progress = inputs[0].getGestureProgress(this.type);

      if (this.direction === 'apart') {
        if (currentDistance > lastDistance && (currentDistance - progress.lastEmittedDistance >= this.threshold)) {
          progress.lastEmittedDistance = currentDistance;
          return {
            distance: currentDistance
          };
        }
      } else {
        if (currentDistance < lastDistance && (progress.lastEmittedDistance - currentDistance >= this.threshold)) {
          progress.lastEmittedDistance = currentDistance;
          return {
            distance: currentDistance
          };
        }
      }

      return null;
    }
  }
}

export default Distance;
