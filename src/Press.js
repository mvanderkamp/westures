/*
 * Contains the Press class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Press is recognized.
 *
 * @typedef {Object} PressData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D} initial - The initial centroid of the input
 * points.
 * @property {number} distance - The total movement since initial contact.
 *
 * @memberof ReturnTypes
 */

/**
 * A Press is defined as one or more input points being held down.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PressData
 * @memberof westures
 */
class Press extends Gesture {
  /**
   * Constructor function for the Press class.
   *
   * @param {function} handler - A Press is unique in that the gesture needs to
   * store the 'handler' callback directly, so it can be called asynchronously.
   * @param {Object} [options] - The options object.
   * @param {number} [options.delay=1000] - The delay before emitting, during
   * which time the number of inputs must not change.
   * @param {number} [options.numInputs=1] - Number of inputs for a Press
   * gesture.
   * @param {number} [options.tolerance=10] - The tolerance in pixels
   * a user can move and still allow the gesture to emit.
   */
  constructor(handler, options = {}) {
    super('press');
    const settings = { ...Press.DEFAULTS, ...options };

    /**
     * The handler to trigger in case a Press is recognized.
     *
     * @private
     * @type {function}
     */
    this.handler = handler;

    /**
     * The delay before emitting a press event, during which time the number of
     * inputs must not change.
     *
     * @private
     * @type {number}
     */
    this.delay = settings.delay;

    /**
     * The number of inputs that must be active for a Press to be recognized.
     *
     * @private
     * @type {number}
     */
    this.numInputs = settings.numInputs;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Press gesture to be triggered more easily.
     *
     * @private
     * @type {number}
     */
    this.tolerance = settings.tolerance;

    /**
     * The initial centroid.
     *
     * @private
     * @type {westures.Point2D}
     */
    this.initial = null;

    /**
     * Saves the timeout callback reference in case it needs to be cleared for
     * some reason.
     *
     * @private
     * @type {number}
     */
    this.timeout = null;
  }

  /**
   * Event hook for the start of a gesture. If the number of active inputs is
   * correct, initializes the timeout.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    if (state.active.length === this.numInputs) {
      this.initial = state.centroid;
      this.timeout = setTimeout(() => this.recognize(state), this.delay);
    }
  }

  /**
   * Recognize a Press.
   *
   * @private
   * @param {State} state - current input state.
   */
  recognize(state) {
    const distance = this.initial.distanceTo(state.centroid);
    if (distance <= this.tolerance) {
      this.handler({
        distance,
        initial:  this.initial,
        centroid: state.centroid,
        type:     this.type,
      });
    }
  }

  /**
   * Event hook for the end of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  end() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
}

Press.DEFAULTS = Object.freeze({
  DELAY_MS:   1000,
  TOLERANCE:  10,
  NUM_INPUTS: 1,
});

module.exports = Press;

