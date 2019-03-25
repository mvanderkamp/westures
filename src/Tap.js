/*
 * Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const defaults = Object.freeze({
  MIN_DELAY_MS:      0,
  MAX_DELAY_MS:      300,
  NUM_INPUTS:        1,
  MOVE_PX_TOLERANCE: 10,
});

/**
 * Data returned when a Tap is recognized.
 *
 * @typedef {Object} TapData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} x - x coordinate of tap point.
 * @property {number} y - y coordinate of tap point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.TapData
 * @memberof westures
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   *
   * @param {Object} [options] - The options object.
   * @param {number} [options.minDelay=0] - The minimum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {number} [options.maxDelay=300] - The maximum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
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
     * @private
     * @type {number}
     */
    this.minDelay = options.minDelay || defaults.MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @private
     * @type {number}
     */
    this.maxDelay = options.maxDelay || defaults.MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @private
     * @type {number}
     */
    this.numInputs = options.numInputs || defaults.NUM_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @private
     * @type {number}
     */
    this.tolerance = options.tolerance || defaults.MOVE_PX_TOLERANCE;

    /**
     * An array of inputs that have ended recently.
     *
     * @private
     * @type {Input[]}
     */
    this.ended = [];
  }

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TapData} <tt>null</tt> if the gesture is not to be
   * emitted, Object with information otherwise.
   */
  end(state) {
    const now = Date.now();

    this.ended = this.ended.concat(state.getInputsInPhase('end'))
      .filter(input => {
        const tdiff = now - input.startTime;
        return tdiff <= this.maxDelay && tdiff >= this.minDelay;
      });

    if (this.ended.length !== this.numInputs ||
        this.ended.some(i => i.totalDistance() > this.tolerance)) {
      return null;
    }

    const centroid = Point2D.midpoint(this.ended.map(i => i.current.point));
    this.ended = [];
    return { centroid, ...centroid };
  }
}

module.exports = Tap;

