/**
 * @file Rotate.js
 * Contains the Rotate class
 */

const Gesture = require('./../core/classes/Gesture.js');
const Point2D = require('./../core/classes/Point2D.js');
const util    = require('./../core/util.js');

const REQUIRED_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving about a circle,
 * maintaining a relatively equal radius.
 * @class Rotate
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor() {
    super('rotate');
  }

  initializeProgress(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length < REQUIRED_INPUTS) return null;

    const { midpoint, averageAngle } = getMidpointAndAverageAngle(active);

    // Progress is stored on the first active input.
    const progress = active[0].getProgressOfGesture(this.id);
    progress.previousAngle = averageAngle;
    progress.distance = 0;
    progress.change = 0;
  }

  start(inputs, state, element) {
    this.initializeProgress(state);
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
    const active = state.getInputsNotInPhase('end');

    const { midpoint, averageAngle } = getMidpointAndAverageAngle(active);

    const progress = active[0].getProgressOfGesture(this.id);
    // progress.change = averageAngle - progress.previousAngle;
    progress.change = getAngleChange(averageAngle, progress.previousAngle);
    progress.distance += progress.change;
    progress.previousAngle = averageAngle;

    return {
      angle: averageAngle,
      distanceFromOrigin: progress.distance,
      distanceFromLast: progress.change,
    };
  }
  /* move*/

  end(inputs, state, element) {
    this.initializeProgress(state);
  }
}

const CIRCLE = 2 * Math.PI;
function getAngleChange(curr, prev) {
  const diff = curr - prev;
  if (diff <= (-Math.PI)) {
    return diff + CIRCLE;
  }

  if (diff >= Math.PI) {
    return diff - CIRCLE;
  }

  return diff;
}

function getMidpointAndAverageAngle(inputs) {
  const points = inputs.map( i => i.current.point );
  const midpoint = Point2D.midpoint(points); 
  const averageAngle = Point2D.averageAngleTo(midpoint, points);
  return { midpoint, averageAngle };
}

module.exports = Rotate;
