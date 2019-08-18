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
 * @see ReturnTypes.PinchData
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 *    is recognized on the associated element.
 */
class Pinch extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Pinch.DEFAULTS, ...options };
    super('pinch', element, handler, settings);

    /**
     * The previous distance.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @private
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable({ ...settings, identity: 1 });
  }

  /**
   * Initializes the gesture progress.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    this.previous = state.centroid.averageDistanceTo(state.activePoints);
    this.outgoing.restart();
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
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PinchData} <tt>null</tt> if not recognized.
   */
  move(state) {
    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const scale = distance / this.previous;
    this.previous = distance;

    return { distance, scale: this.outgoing.next(scale) };
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
   */
  cancel() {
    this.previous = 0;
    this.outgoing.restart();
  }
}

Pinch.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Pinch;

