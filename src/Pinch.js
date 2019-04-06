/*
 * Contains the abstract Pinch class.
 */

'use strict';

const { Gesture, Smoothable } = require('westures-core');

/**
 * Data returned when a Pinch is recognized.
 *
 * @typedef {Object} PinchData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 *    the centroid.
 * @property {number} scale - The proportional change in distance since last
 * emit.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends westures.Gesture
 * @mixes westures.Smoothable
 * @see ReturnTypes.PinchData
 * @memberof westures
 */
class Pinch extends Smoothable(Gesture) {
  /**
   * @param {Object} [options]
   * @param {number} [options.minInputs=2] The minimum number of inputs that
   * must be active for a Pinch to be recognized.
   */
  constructor(options = {}) {
    const settings = { ...Pinch.DEFAULTS, ...options };
    super('pinch', settings);

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * The previous distance.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;
  }

  /**
   * Initializes the gesture progress and stores it in the first input for
   * reference events.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    if (state.active.length >= this.minInputs) {
      const distance = state.centroid.averageDistanceTo(state.activePoints);
      this.previous = distance;
    }
    super.restart();
  }

  /**
   * Event hook for the start of a Pinch.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Pinch.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PinchData} <tt>null</tt> if not recognized.
   */
  move(state) {
    if (state.active.length < this.minInputs) return null;

    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const scale = distance / this.previous;

    this.previous = distance;
    return this.emit({ distance, scale }, 'scale');
  }

  /**
   * Event hook for the end of a Pinch.
   *
   * @private
   * @param {State} input status object
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Pinch.
   *
   * @private
   * @param {State} input status object
   */
  cancel(state) {
    this.restart(state);
  }
}

Pinch.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Pinch;

