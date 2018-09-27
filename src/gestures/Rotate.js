/**
 * @file Rotate.js
 * Contains the Rotate class
 */

const Gesture = require('../core/Gesture.js');
const Point2D = require('../core/Point2D.js');
const util    = require('../core/util.js');

const REQUIRED_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving about a circle, maintaining a
 * relatively equal radius.
 *
 * @class Rotate
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor() {
    super('rotate');
  }

  /**
   * Initialize the progress of the gesture.  Only runs if the number of active
   * inputs is the expected amount.
   *
   * @param {State} input status object
   */
  initializeProgress(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length !== REQUIRED_INPUTS) return null;

    // Progress is stored on the first active input.
    const angle = active[0].currentAngleTo(active[1]);
    const progress = active[0].getProgressOfGesture(this.id);
    progress.previousAngle = angle;
    progress.distance = 0;
    progress.change = 0;
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @param {State} input status object
   *
   * @return {null}
   */
  start(state) {
    this.initializeProgress(state);
  }

  /**
   * Event hook for the move of a gesture. Obtains the midpoint of two the two
   * inputs and calculates the projection of the right most input along a unit
   * circle to obtain an angle. This angle is compared to the previously
   * calculated angle to output the change of distance, and is compared to the
   * initial angle to output the distance from the initial angle to the current
   * angle.
   *
   * @param {State} input status object
   *
   * @return {null} - null if this event did not occur
   * @return {Object} obj.angle - The current angle along the unit circle
   * @return {Object} obj.distanceFromOrigin - The angular distance travelled
   * from the initial right most point.
   * @return {Object} obj.distanceFromLast - The change of angle between the
   * last position and the current position.
   */
  move(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length !== REQUIRED_INPUTS) return null;

    const pivot = active[0].currentMidpointTo(active[1]);
    const angle = active[0].currentAngleTo(active[1]);

    const progress = active[0].getProgressOfGesture(this.id);
    progress.change = angle - progress.previousAngle;
    progress.distance += progress.change;
    progress.previousAngle = angle;

    return {
      angle,
      pivot,
      distanceFromOrigin: progress.distance,
      distanceFromLast: progress.change,
    };
  }
  /* move*/

  /**
   * Event hook for the end of a gesture.
   *
   * @param {State} input status object
   *
   * @return {null}
   */
  end(state) {
    this.initializeProgress(state);
  }
}

module.exports = Rotate;

