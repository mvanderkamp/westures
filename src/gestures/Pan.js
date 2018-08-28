/**
 * @file Pan.js
 * Contains the Pan class
 */

const Gesture = require('./../core/classes/Gesture.js');
const Point2D = require('./../core/classes/Point2D.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 1;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pan is defined as a normal movement in any direction on a screen.
 * Pan gestures do not track start events and can interact with pinch and \
 *  expand gestures.
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   * @param {Object} [options] - The options object.
   * @param {Number} [options.numInputs=1] - Number of inputs for the
   *  Pan gesture.
   * @param {Number} [options.threshold=1] - The minimum number of
   * pixels the input has to move to trigger this gesture.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pan';

    /**
     * The number of inputs to trigger a Pan can be variable,
     * and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * The minimum amount in pixels the pan must move until it is fired.
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Event hook for the start of a gesture. Marks each input as active,
   * so it can invalidate any end events.
   * @param {Array} inputs
   */
  start(inputs) {
    inputs.forEach((input) => {
      const progress = input.getGestureProgress(this.getId());
      progress.active = true;
      progress.lastEmitted = Point2D.clone(input.current.point);
    });
  }
  /* start */

  /**
   * move() - Event hook for the move of a gesture.
   * Fired whenever the input length is met, and keeps a boolean flag that
   * the gesture has fired at least once.
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {Object} - Returns the distance in pixels between the two inputs.
   */
  move(inputs, state, element) {
    if (this.numInputs !== inputs.length) return null;

    const output = {
      data: [],
    };

    inputs.forEach( (input, index) => {
      const progress = input.getGestureProgress(this.getId());
      const distanceFromLastEmit = progress.lastEmitted.distanceTo(
        input.current.point
      );
      const reachedThreshold = distanceFromLastEmit >= this.threshold;

      if (progress.active && reachedThreshold) {
        output.data[index] = packData( input, progress );
        progress.lastEmitted = Point2D.clone(input.current.point);
      } 
    });

    return output;
  }
  /* move*/

  /**
   * end() - Event hook for the end of a gesture. If the gesture has at least
   * fired once, then it ends on the first end event such that any remaining
   * inputs will not trigger the event until all inputs have reached the
   * touchend event. Any touchend->touchstart events that occur before all
   * inputs are fully off the screen should not fire.
   * @param {Array} inputs - The array of Inputs on the screen
   * @return {null} - null if the gesture is not to be emitted,
   *  Object with information otherwise.
   */
  end(inputs) {
    inputs.forEach((input) => {
      const progress = input.getGestureProgress(this.getId());
      progress.active = false;
    });
    return null;
  }
  /* end*/
}

function packData( input, progress ) {
  const distanceFromOrigin = input.totalDistance();
  const directionFromOrigin = input.totalAngle();
  const currentDirection = progress.lastEmitted.angleTo(input.current.point);
  const change = input.current.point.subtract(progress.lastEmitted);

  return {
    distanceFromOrigin,
    directionFromOrigin,
    currentDirection,
    change,
  };
}

module.exports = Pan;
