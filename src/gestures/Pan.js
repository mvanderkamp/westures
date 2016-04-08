/**
 * @file Pan.js
 * Contains the Pan class
 */

import Gesture from './Gesture.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 1;
const DEFAULT_MIN_THRESHOLD = 1;
const DEFAULT_THRESHOLD_DIR = null;

/**
 * A Pan is defined as a normal movement in any direction on a screen. Pan gestures do not
 * track start events and can interact with pinch and expand gestures.
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   * @param {Object} options - The options object.
   * @param {Number} [options.numInputs=1] - Number of inputs for the Pan gesture.
   * @param {Number} [options.threshold=1] - The minimum number of pixels the input
   * has to move to trigger this gesture.
   * @param {String|null} [options.thresholdDirection] - The direction of the Pan event
   */
  constructor(options) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pan';

    /**
     * The number of inputs to trigger a Pan can be variable, and the maximum number
     * being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = (options && options.numInputs) ? options.numInputs : DEFAULT_INPUTS;

    /**
     * The minimum amount in pixels the pan must move until it is fired.
     * @type {Number}
     */
    this.threshold = (options && options.threshold) ? options.threshold : DEFAULT_MIN_THRESHOLD;

    /**
     * The threshold direction. Can be 'x', 'y' or null (any direction).
     */
    this.thresholdDirection = (options && options.thresholdDirection) ? options.thresholdDirection : DEFAULT_THRESHOLD_DIR;
  }

  /*constructor*/

  /**
   * start() - Event hook for the start of a gesture. Marks each input as active, so it can invalidate any end
   * events.
   * @param inputs
   */
  start(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      var progress = inputs[i].getGestureProgress(this.getId());
      progress.active = true;
      progress.lastEmitted = {
        x: inputs[i].current.x,
        y: inputs[i].current.y
      };
    }
  }

  /**
   * move() - Event hook for the move of a gesture. Fired whenever the input length is met,
   * and keeps a boolean flag that the gesture has fired at least once.
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @returns {Object} - Returns the distance in pixels between the two inputs.
   */
  move(inputs, state) {
    if (this.numInputs === inputs.length) {
      var data = {};
      for (var i = 0; i < inputs.length; i++) {
        var progress = inputs[i].getGestureProgress(this.getId());

        var reachedThreshold = false;

        //Check threshold distance and direction
        switch (this.thresholdDirection) {
          case 'x':

            //Right movement
            if (inputs[i].current.x  > progress.lastEmitted.x) {
              reachedThreshold = (inputs[i].current.x - progress.lastEmitted.x > this.threshold);

              //Left movement
            } else {
              reachedThreshold = (progress.lastEmitted.x - inputs[i].current.x  > this.threshold);
            }

            break;
          case 'y':

            //Up movement
            if (inputs[i].current.y  < progress.lastEmitted.y) {
              reachedThreshold = (progress.lastEmitted.y - inputs[i].current.y  > this.threshold);

              //Down movement
            } else {
              reachedThreshold = (inputs[i].current.y - progress.lastEmitted.y  > this.threshold);
            }

            break;
          case null :
            reachedThreshold =  (Math.abs(inputs[i].current.y - progress.lastEmitted.y) > this.threshold ||
              Math.abs(inputs[i].current.x - progress.lastEmitted.x) > this.threshold);
            break;
        }

        if (progress.active && reachedThreshold) {

          data[i] = {
            distanceFromOrigin: util.distanceBetweenTwoPoints(inputs[i].initial.x, inputs[i].current.x,
              inputs[i].initial.y, inputs[i].current.y),
            directionFromOrigin: util.getAngle(inputs[i].initial.x, inputs[i].initial.y, inputs[i].current.x, inputs[i].current.y),
            currentDirection: util.getAngle(progress.lastEmitted.x, progress.lastEmitted.y, inputs[i].current.x, inputs[i].current.y)
          };
          progress.lastEmitted.x = inputs[i].current.x;
          progress.lastEmitted.y = inputs[i].current.y;

        } else {
          return null;
        }

      }
    }

    return data;
  }

  /*move*/

  /**
   * end() - Event hook for the end of a gesture. If the gesture has at least fired once, then it
   * ends on the first end event such that any remaining inputs will not trigger the event until
   * all inputs have reached the touchend event. Any touchend->touchstart events that occur
   * before all inputs are fully off the screen should not fire.
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - null if the gesture is not to be emitted, Object with information otherwise.
   */
  end(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      var progress = inputs[i].getGestureProgress(this.getId());
      if (progress.active) {
        progress.active = false;
        break;
      }
    }

    return null;
  }

  /*end*/
}

export default Pan;
