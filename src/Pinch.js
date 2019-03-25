/*
 * Contains the abstract Pinch class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Pinch is recognized.
 *
 * @typedef {Object} PinchData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 *    the centroid.
 * @property {number} change - The change in distance since last emit.
 * @property {westures.Point2D} midpoint - The centroid of the currently active
 *    points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PinchData
 * @memberof westures
 */
class Pinch extends Gesture {
  /**
   * @param {Object} [options]
   * @param {number} [options.minInputs=2] The minimum number of inputs that
   * must be active for a Pinch to be recognized.
   * @param {boolean} [options.smoothing=true] Whether to apply smoothing to
   * emitted data.
   */
  constructor(options = {}) {
    super('pinch');
    const settings = { ...Pinch.DEFAULTS, ...options };

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * The function through which emits are passed.
     *
     * @private
     * @type {function}
     */
    this.emit = null;
    if (settings.smoothing) {
      this.emit = this.smooth.bind(this);
    } else {
      this.emit = data => data;
    }

    /**
     * The previous distance.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

    /**
     * Stage the emitted data once.
     *
     * @private
     * @type {ReturnTypes.RotateData}
     */
    this.stagedEmit = null;
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
    this.stagedEmit = null;
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
    return this.emit({ distance, scale });
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

  /**
   * Smooth out the outgoing data.
   *
   * @private
   * @param {ReturnTypes.PinchData} next
   *
   * @return {?ReturnTypes.PinchData}
   */
  smooth(next) {
    let result = null;

    if (this.stagedEmit) {
      result = this.stagedEmit;
      const avg = (result.scale + next.scale) / 2;
      result.scale = avg;
      next.scale = avg;
    }

    this.stagedEmit = next;
    return result;
  }
}

Pinch.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Pinch;

