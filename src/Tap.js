/**
 * @file Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const defaults = Object.freeze({
  MIN_DELAY_MS: 0,
  MAX_DELAY_MS: 300,
  NUM_INPUTS: 1,
  MOVE_PX_TOLERANCE: 10,
});

/**
 * @typedef TapData
 * @type {Object}
 * @property {Number} x - x coordinate of tap point.
 * @property {Number} y - y coordinate of tap point.
 */

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
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
    this.minDelay = options.minDelay || defaults.MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @type {Number}
     */
    this.maxDelay = options.maxDelay || defaults.MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @type {Number}
     */
    this.numInputs = options.numInputs || defaults.NUM_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance || defaults.MOVE_PX_TOLERANCE;

    /**
     * An array of inputs that have ended recently.
     */
    this.ended = [];
  }
  /* constructor*/

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met. 
   *
   * @param {State} state - current input state.
   * @return {?TapData} - null if the gesture is not to be emitted, Object
   *    with information otherwise. 
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
        !this.ended.every( i => i.totalDistance() <= this.tolerance)) {
      return null;
    }

    const { x, y } = Point2D.midpoint( this.ended.map( i => i.current.point ) );
    return { x, y };
  }
  /* end*/
}

module.exports = Tap;

