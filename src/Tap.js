/*
 * Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('../core');

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
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {number} [options.minDelay=0] - The minimum delay between a touchstart
 * and touchend can be configured in milliseconds.
 * @param {number} [options.maxDelay=300] - The maximum delay between a
 * touchstart and touchend can be configured in milliseconds.
 * @param {number} [options.maxRetain=300] - The maximum time after a tap ends
 * before it is discarded can be configured in milliseconds. Useful for
 * multi-tap gestures.
 * @param {number} [options.numTaps=1] - Number of taps to require.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move.
 */
class Tap extends Gesture {
  constructor(element, handler, options = {}) {
    options = { ...Tap.DEFAULTS, ...options };
    super('tap', element, handler, options);

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds.
     *
     * @type {number}
     */
    this.minDelay = options.minDelay;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds.
     *
     * @type {number}
     */
    this.maxDelay = options.maxDelay;

    /**
     * The maximum delay after a touchend before an as-yet-unused tap is
     * discarded can be configured in milliseconds. Useful for multi-tap
     * gestures, to allow things like slow "double clicks".
     *
     * @type {number}
     */
    this.maxRetain = options.maxRetain;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @type {number}
     */
    this.numTaps = options.numTaps;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance;

    /**
     * An array of inputs that have ended recently.
     *
     * @type {Input[]}
     */
    this.taps = [];
  }

  end(state) {
    const now = Date.now();

    // Save the recently ended inputs as taps.
    this.taps = this.taps.concat(state.getInputsInPhase('end'))
      .filter(input => {
        const elapsed = input.elapsedTime;
        const tdiff = now - input.current.time;
        return (
          elapsed <= this.maxDelay
          && elapsed >= this.minDelay
          && tdiff <= this.maxRetain
        );
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
  maxRetain: 300,
  numTaps:   1,
  tolerance: 10,
});

module.exports = Tap;

