/**
 * @file Rotate.js
 * Contains the Rotate class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving about a circle, maintaining a relatively equal radius.
 * @class Rotate
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor() {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'rotate';
  }

  /**
   * move() - Event hook for the move of a gesture. Obtains the midpoint of two the two inputs and
   * calculates the projection of the right most input along a unit circle to obtain an angle.
   * This angle is compared to the previously calculated angle to output the change of distance,
   * and is compared to the initial angle to output the distance from the initial angle to the
   * current angle.
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - null if this event did not occur
   * @returns {Object} obj.angle - The current angle along the unit circle
   * @returns {Object} obj.distance - The angular distance travelled from the initial right
   * most point.
   * @returns {Object} obj.change - The change of angle between the last position and
   * the current position.
   */
  move(inputs) {
    if (state.numActiveInputs() === DEFAULT_INPUTS) {

      var referencePivot = util.getMidpoint(inputs[0].initial.x, inputs[1].initial.x,
        inputs[0].initial.y, inputs[1].initial.y);
      var currentPivot = util.getMidpoint(inputs[0].current.x, inputs[1].current.x,
        inputs[0].current.y, inputs[1].current.y);
      var diffX = referencePivot.x - currentPivot.x;
      var diffY = referencePivot.y - currentPivot.y;
      var input = util.getRightMostInput(inputs);

      //Translate the current pivot point.
      var currentAngle = util.getAngle(referencePivot.x, referencePivot.y,
        input.current.x + diffX, input.current.y + diffY);

      var progress = input.getGestureProgress(this.getId());
      if (!progress.initialAngle) {
        progress.initialAngle = progress.previousAngle = currentAngle;
        progress.distance = progress.change = 0;
      } else {
        progress.change = util.getAngularDistance(progress.previousAngle, currentAngle);
        progress.distance = progress.distance + progress.change;
      }

      progress.previousAngle = currentAngle;

      return {
        angle: currentAngle,
        distance: progress.distance,
        change: progress.change
      };
    }

    return null;
  }
  /*move*/
}

export default Rotate;
