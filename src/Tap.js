/*
 * Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

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
 * @extends westures-core.Gesture
 * @see {ReturnTypes.TapData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {Object} [options] - The options object.
 * @param {number} [options.minDelay=0] - The minimum delay between a touchstart
 * and touchend can be configured in milliseconds.
 * @param {number} [options.maxDelay=300] - The maximum delay between a
 * touchstart and touchend can be configured in milliseconds.
 * @param {number} [options.numTaps=1] - Number of taps to require.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move.
 */
class Tap extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Tap.DEFAULTS, ...options };
    super('tap', element, handler, settings);

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds. The minimum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @private
     * @type {number}
     */
    this.minDelay = settings.minDelay;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @private
     * @type {number}
     */
    this.maxDelay = settings.maxDelay;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @private
     * @type {number}
     */
    this.numTaps = settings.numTaps;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @private
     * @type {number}
     */
    this.tolerance = settings.tolerance;

    /**
     * An array of inputs that have ended recently.
     *
     * @private
     * @type {Input[]}
     */
    this.taps = [];
  }

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TapData} <tt>null</tt> if the gesture is not to be
   * emitted, Object with information otherwise.
   */
  end(state) {
    const now = Date.now();

    // Save the recently ended inputs as taps.
    this.taps = this.taps.concat(state.getInputsInPhase('end'))
      .filter(input => {
        const tdiff = now - input.startTime;
        return tdiff <= this.maxDelay && tdiff >= this.minDelay;
      });

    // Validate the list of taps.
    if (this.taps.length !== this.numTaps ||
      this.taps.some(i => i.totalDistance() > this.tolerance)) {
      return null;
    }

    const centroid = Point2D.centroid(this.taps.map(i => i.current.point));
    this.taps = []; // Critical! Used taps need to be cleared!
    return { centroid, ...centroid };
  }
}

Tap.DEFAULTS = Object.freeze({
  minDelay:  0,
  maxDelay:  300,
  numTaps:   1,
  tolerance: 10,
});

module.exports = Tap;

