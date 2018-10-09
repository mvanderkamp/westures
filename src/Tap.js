/**
 * @file Tap.js
 * Contains the Tap class
 */

const Gesture = require('../../westures-core/src/Gesture.js');
const Point2D = require('../../westures-core/src/Point2D.js');

const DEFAULT_MIN_DELAY_MS = 0;
const DEFAULT_MAX_DELAY_MS = 300;
const DEFAULT_INPUTS = 1;
const DEFAULT_MOVE_PX_TOLERANCE = 10;

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 *
 * @class Tap
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   *
   * @param {Object} [options] - The options object.
   * @param {Number} [options.minDelay=0] - The minimum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.maxDelay=300] - The maximum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {Number} [options.tolerance=10] - The tolerance in pixels a user can
   *    move.
   */
  constructor(options = {}) {
    super('tap');

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds. The minimum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.  
     *
     * @type {Number}
     */
    this.minDelay = options.minDelay || DEFAULT_MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @type {Number}
     */
    this.maxDelay = options.maxDelay || DEFAULT_MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance || DEFAULT_MOVE_PX_TOLERANCE;

    /**
     * An array of inputs that have ended recently.
     */
    this.ended = [];
  }
  /* constructor*/

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met. Also waits for all
   * of the inputs to be off the screen before determining if the gesture is
   * triggered.
   *
   * @param {State} input status object
   *
   * @return {null|Object} - null if the gesture is not to be emitted, Object
   *    with information otherwise. Returns the interval time between start and
   *    end events.
   */
  end(state) {
    const now = Date.now();

    this.ended = this.ended.concat(state.getInputsInPhase('end'))
      .filter( i => {
        const tdiff = now - i.startTime;
        return tdiff <= this.maxDelay && tdiff >= this.minDelay;
      });

    if (this.ended.length === 0 ||
        this.ended.length !== this.numInputs || 
        !this.ended.every( i => i.totalDistanceIsWithin(this.tolerance))) {
      return null;
    }

    const {x,y} = Point2D.midpoint( this.ended.map( i => i.current.point ) );
    return {x,y};
  }
  /* end*/
}

module.exports = Tap;

