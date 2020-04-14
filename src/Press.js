/*
 * Contains the Press class.
 */

'use strict';

const { Gesture, Point2D, MOVE } = require('westures-core');

/**
 * Data returned when a Press is recognized.
 *
 * @typedef {Object} PressData
 *
 * @property {westures-core.Point2D} centroid - The current centroid of the
 * input points.
 * @property {westures-core.Point2D} initial - The initial centroid of the input
 * points.
 * @property {number} distance - The total movement since initial contact.
 *
 * @memberof ReturnTypes
 */

/**
 * A Press is defined as one or more input points being held down.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PressData}
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
 * @param {number} [options.delay=1000] - The delay before emitting, during
 * which time the number of inputs must not go below minInputs.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move and still allow the gesture to emit.
 */
class Press extends Gesture {
  constructor(element, handler, options = {}) {
    options = { ...Press.DEFAULTS, ...options };
    super('press', element, handler, options);

    /**
     * The delay before emitting a press event, during which time the number of
     * inputs must not change.
     *
     * @type {number}
     */
    this.delay = options.delay;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Press gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance;

    /**
     * The initial centroid.
     *
     * @type {westures-core.Point2D}
     */
    this.initial = null;

    /**
     * The identities of the pointers that were active when initiated.
     *
     * @type {Array.<number>};
     */
    this.identifiers = [];

    /**
     * Saves the timeout callback reference in case it needs to be cleared for
     * some reason.
     *
     * @type {number}
     */
    this.timeout = null;
  }

  start(state) {
    this.initial = state.centroid;
    this.identifiers = new Set(state.active.map(i => i.identifier));

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.attempt(state), this.delay);
  }

  /**
   * Retrieve the inputs that were present initially.
   *
   * @param {westures-core.State} state - current input state.
   */
  initialInputs(state) {
    return state.active.filter(i => this.identifiers.has(i.identifier));
  }

  /**
   * Try to recognize a Press.
   *
   * @param {westures-core.State} state - current input state. Note that
   * although it was bound when the timeout was set, it is expected to be the
   * same state object as the current active one, and thus reflective of the
   * current state.
   */
  attempt(state) {
    const inputs = this.initialInputs(state);
    const centroid = Point2D.centroid(inputs.map(i => i.current.point));
    const distance = this.initial.distanceTo(centroid);
    if (distance <= this.tolerance) {
      super.recognize(MOVE, state, {
        centroid,
        distance,
        initial:  this.initial,
      });
    }
  }

  end(state) {
    if (this.initialInputs(state).length !== this.identifiers.length) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

Press.DEFAULTS = Object.freeze({
  delay:     1000,
  tolerance: 10,
});

module.exports = Press;

