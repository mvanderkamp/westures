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

    /**
     * The minimum amount in pixels the inputs must move until it is fired.
     * @type {Number}
     */
    this.threshold = (options && options.threshold) ? options.threshold : DEFAULT_MIN_THRESHOLD;

    /**
     * The trend in direction of both inputs. Either 'apart' or 'together'
     * @type {string}
     */
    this.direction = (options && options.direction) ? options.direction : DEFAULT_DIRECTION;
  }

  /**
   * start() - Event hook for the start of a gesture. Initialized the lastEmitted gesture and stores it in the first input for reference.
   * events.
   * @param inputs
   */
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
   * @param {Object} state - The state object of the current region.
   * @returns {Object | null} - Returns the distance in pixels between the two inputs.
   */
  move(inputs, state) {
    if (state.numActiveInputs() === DEFAULT_INPUTS) {
      var currentDistance = util.distanceBetweenTwoPoints(inputs[0].current.x, inputs[1].current.x,
        inputs[0].current.y, inputs[1].current.y);
      var lastDistance = util.distanceBetweenTwoPoints(inputs[0].previous.x, inputs[1].previous.x,
        inputs[0].previous.y, inputs[1].previous.y);

      //Retrieve the first input's progress.
      var progress = inputs[0].getGestureProgress(this.type);

      if (this.direction === 'apart') {
        if (currentDistance < lastDistance) {
          progress.lastEmittedDistance = currentDistance;
        } else if ((currentDistance - progress.lastEmittedDistance >= this.threshold)) {
          progress.lastEmittedDistance = currentDistance;
          return {
            distance: currentDistance
          };
        }
      } else {
        if (currentDistance > lastDistance) {
          progress.lastEmittedDistance = currentDistance;
        } else if (currentDistance < lastDistance && (progress.lastEmittedDistance - currentDistance >= this.threshold)) {
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
