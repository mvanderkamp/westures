/*
 * Contains the Press class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

/**
 * Data returned when a Press is recognized.
 *
 * @typedef {Object} PressData
 *
 * @property {westures.Point2D} centroid - The current centroid of the input
 * points.
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
 * @see {ReturnTypes.PressData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {Object} [options] - The options object.
 * @param {number} [options.delay=1000] - The delay before emitting, during
 * which time the number of inputs must not go below minInputs.
 * @param {number} [options.minInputs=1] - Number of inputs for a Press
 * gesture.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move and still allow the gesture to emit.
 */
class Press extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Press.DEFAULTS, ...options };
    super('press', element, handler, settings);

    /**
     * The delay before emitting a press event, during which time the number of
     * inputs must not change.
     *
     * @private
     * @type {number}
     */
    this.delay = settings.delay;

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
    this.initial = state.centroid;
    this.timeout = setTimeout(() => this.recognize(state), this.delay);
  }

  /**
   * Recognize a Press.
   *
   * @private
   * @param {State} state - current input state.
   */
  recognize(state) {
    const inputs = state.active.slice(0, this.minInputs);
    const points = inputs.map(i => i.current.point);
    const centroid = Point2D.centroid(points);
    const distance = this.initial.distanceTo(centroid);
    if (distance <= this.tolerance) {
      this.handler({
        distance,
        centroid,
        initial:  this.initial,
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
  end(state) {
    if (state.active.length < this.minInputs) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

Press.DEFAULTS = Object.freeze({
  delay:     1000,
  tolerance: 10,
  minInputs: 1,
});

module.exports = Press;

