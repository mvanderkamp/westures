/*
 * Contains the Rotate class.
 */

'use strict';

const { angularDifference, Gesture, Smoothable } = require('westures-core');

/**
 * Data returned when a Rotate is recognized.
 *
 * @typedef {Object} RotateData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 *
 * @memberof ReturnTypes
 */

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends westures.Gesture
 * @see {ReturnTypes.RotateData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {Object} [options]
 * @param {number} [options.minInputs=2] The minimum number of inputs that must
 * be active for a Rotate to be recognized.
 * @param {boolean} [options.smoothing=true] Whether to apply smoothing to
 * emitted data.
 */
class Rotate extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Rotate.DEFAULTS, ...options };
    super('rotate', element, handler, settings);

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

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @private
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable(settings);
  }

  /**
   * Store individual angle progress on each input, return average angle change.
   *
   * @private
   * @param {State} state - current input state.
   */
  getAngle(state) {
    let angle = 0;
    const stagedAngles = [];

    state.active.forEach((input, idx) => {
      const currentAngle = state.centroid.angleTo(input.current.point);
      angle += angularDifference(currentAngle, this.previousAngles[idx]);
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
    this.outgoing.restart();
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
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.RotateData} <tt>null</tt> if this event did not occur
   */
  move(state) {
    const rotation = this.getAngle(state);
    if (rotation) {
      return { rotation: this.outgoing.next(rotation) };
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
   */
  cancel() {
    this.outgoing.restart();
  }
}

Rotate.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Rotate;

