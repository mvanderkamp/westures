/**
 * @file Rotate.js
 * Contains the Rotate class
 */

const Gesture = require('./../core/classes/Gesture.js');
const Point2D = require('./../core/classes/Point2D.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving about a circle,
 * maintaining a relatively equal radius.
 * @class Rotate
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'rotate';

    /**
     * The number of touches required to emit Rotate events.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;
  }

  /**
   * move() - Event hook for the move of a gesture. Obtains the midpoint of two
   * the two inputs and calculates the projection of the right most input along
   * a unit circle to obtain an angle. This angle is compared to the previously
   * calculated angle to output the change of distance, and is compared to the
   * initial angle to output the distance from the initial angle to the current
   * angle.
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current listener.
   * @param {Element} element - The element associated to the binding.
   * @return {null} - null if this event did not occur
   * @return {Object} obj.angle - The current angle along the unit circle
   * @return {Object} obj.distanceFromOrigin - The angular distance travelled
   * from the initial right most point.
   * @return {Object} obj.distanceFromLast - The change of angle between the
   * last position and the current position.
   */
  move(inputs, state, element) {
    const numActiveInputs = state.numActiveInputs();
    if (this.numInputs !== numActiveInputs) return null;

    let currentPivot, initialPivot;
    let input;
    if (numActiveInputs === 1) {
      const bRect = element.getBoundingClientRect();
      currentPivot = new Point2D(
        bRect.left + bRect.width / 2,
        bRect.top + bRect.height / 2,
      );
      initialPivot = currentPivot;
      input = inputs[0];
    } else {
      currentPivot = inputs[0].midpointTo(inputs[1]);
      input = util.getRightMostInput(inputs);
    }

    // Translate the current pivot point.
    const currentAngle = currentPivot.angleTo(input.current.point);

    const progress = input.getGestureProgress(this.getId());
    if (!progress.initialAngle) {
      progress.initialAngle = currentAngle;
      progress.previousAngle = currentAngle;
      progress.distance = 0;
      progress.change = 0;
    } else {
      progress.change = currentAngle - progress.previousAngle;
      progress.distance = progress.distance + progress.change;
    }

    progress.previousAngle = currentAngle;

    return {
      angle: currentAngle,
      distanceFromOrigin: progress.distance,
      distanceFromLast: progress.change,
    };
  }

  /* move*/
}

module.exports = Rotate;
