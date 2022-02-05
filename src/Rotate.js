/*
 * Contains the Rotate class.
 */

'use strict';

const { angularDifference, Gesture, Smoothable } = require('../core');

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
 * @extends westures-core.Gesture
 * @see {ReturnTypes.RotateData}
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
class Rotate extends Gesture {
  constructor(element, handler, options = {}) {
    options = { ...Rotate.DEFAULTS, ...options };
    super('rotate', element, handler, options);

    /**
     * Track the previous angles for each input.
     *
     * @type {number[]}
     */
    this.previousAngles = [];

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable(options);
  }

  /**
   * Restart the gesture for a new number of inputs.
   *
   * @param {State} state - current input state.
   */
  restart(state) {
    this.previousAngles = state.centroid.anglesTo(state.activePoints);
    this.outgoing.restart();
  }

  start(state) {
    this.restart(state);
  }

  move(state) {
    const stagedAngles = state.centroid.anglesTo(state.activePoints);
    const angle = stagedAngles.reduce((total, current, index) => {
      return total + angularDifference(current, this.previousAngles[index]);
    }, 0);
    this.previousAngles = stagedAngles;
    const rotation = angle / state.activePoints.length;
    return { rotation: this.outgoing.next(rotation) };
  }

  end(state) {
    this.restart(state);
  }

  cancel() {
    this.outgoing.restart();
  }
}

Rotate.DEFAULTS = Object.freeze({
  minInputs: 2,
});

module.exports = Rotate;

