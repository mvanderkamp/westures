/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture, Smoothable } = require('../../westures-core');
const angularMinus = require('./angularMinus.js');

/**
 * Data returned when a Rotate is recognized.
 *
 * @typedef {Object} RotateData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 * @property {westures.Point2D} pivot - The centroid of the currently
 * active points.
 *
 * @memberof ReturnTypes
 */

// const PI2 = 2 * Math.PI;

/**
 * Helper function to regulate angular differences, so they don't jump from 0 to
 * 2*PI or vice versa.
 *
 * @private
 * @param {number} a - Angle in radians.
 * @param {number} b - Angle in radians.
 * @return {number} c, given by: c = a - b such that || < PI
 */
// function angularMinus(a, b = 0) {
//   let diff = a - b;
//   if (diff < -Math.PI) {
//     diff += PI2;
//   } else if (diff > Math.PI) {
//     diff -= PI2;
//   }
//   return diff;
// }

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends westures.Gesture
 * @mixes westures.Smoothable
 * @see ReturnTypes.RotateData
 * @memberof westures
 */
class Rotate extends Smoothable(Gesture) {
  /**
   * @param {Object} [options]
   * @param {number} [options.minInputs=2] The minimum number of inputs that
   * must be active for a Rotate to be recognized.
   * @param {boolean} [options.smoothing=true] Whether to apply smoothing to
   * emitted data.
   */
  constructor(options = {}) {
    super('rotate', options);
    const settings = { ...Rotate.DEFAULTS, ...options };

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * Track the previously emitted rotation angle.
     *
     * @private
     * @type {number[]}
     */
    this.previousAngles = [];
  }

  /**
   * Store individual angle progress on each input, return average angle change.
   *
   * @private
   * @param {State} state - current input state.
   */
  getAngle(state) {
    if (state.active.length < this.minInputs) return null;

    let angle = 0;
    const stagedAngles = [];

    state.active.forEach((input, idx) => {
      const currentAngle = state.centroid.angleTo(input.current.point);
      angle += angularMinus(currentAngle, this.previousAngles[idx]);
      stagedAngles[idx] = currentAngle;
    });

    angle /= (state.active.length);
    this.previousAngles = stagedAngles;
    return angle;
  }

  /**
   * Restart the gesture;
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    this.previousAngles = [];
    this.getAngle(state);
    super.restart();
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Rotate gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.RotateData} <tt>null</tt> if this event did not occur
   */
  move(state) {
    const rotation = this.getAngle(state);
    if (rotation) {
      return this.emit({ rotation }, 'rotation');
    }
    return null;
  }

  /**
   * Event hook for the end of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.restart(state);
  }
}

Rotate.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Rotate;

