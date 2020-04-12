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
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PinchData}
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
 * @param {number} [options.minInputs=2] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 */
class Pinch extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Pinch.DEFAULTS, ...options };
    super('pinch', element, handler, settings);

    /**
     * The previous distance.
     *
     * @type {number}
     */
    this.previous = 0;

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable({ ...settings, identity: 1 });
  }

  /**
   * Initializes the gesture progress.
   *
   * @param {State} state - current input state.
   */
  restart(state) {
    this.previous = state.centroid.averageDistanceTo(state.activePoints);
    this.outgoing.restart();
  }

  start(state) {
    this.restart(state);
  }

  move(state) {
    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const scale = distance / this.previous;
    this.previous = distance;
    return { distance, scale: this.outgoing.next(scale) };
  }

  end(state) {
    this.restart(state);
  }

  cancel() {
    this.previous = 0;
    this.outgoing.restart();
  }
}

Pinch.DEFAULTS = Object.freeze({
  minInputs: 2,
});

module.exports = Pinch;

