/**
 * @file Expand.js
 * Contains the Expand class
 */

import Gesture from './Gesture.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;

/**
 * An Expand is defined as two inputs moving farther away from each other. This gesture does
 * not account for any start/end events to allow for the event to interact with the Pan and Pinch
 * events.
 * @class Expand
 */
class Expand extends Gesture {
  /**
   * Constructor function for the Expand class.
   */
  constructor() {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'expand';
  }

  /**
   * Event hook for the move of a gesture. Determines if the two points moved away from each
   * other between.
   * the current distance and the last distance.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @returns {Object | null} - Returns the distance in pixels between the two inputs.
   */
  move(inputs) {
    if (inputs.length === DEFAULT_INPUTS) {
      var currentDistance = util.distanceBetweenTwoPoints(inputs[0].current.x, inputs[1].current.x,
          inputs[0].current.y, inputs[1].current.y);
      var lastDistance = util.distanceBetweenTwoPoints(inputs[0].previous.x, inputs[1].previous.x,
          inputs[0].previous.y, inputs[1].previous.y);
      if (currentDistance > lastDistance) {
        return {
          distance: currentDistance
        };

      } else {
        return null;
      }
    }
  }
}

export default Expand;
