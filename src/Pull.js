/*
 * Contains the abstract Pull class.
 */

'use strict';

const { Smoothable } = require('westures-core');
const Pivotable = require('./Pivotable.js');

/**
 * Data returned when a Pull is recognized.
 *
 * @typedef {Object} PullData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 * the centroid.
 * @property {number} scale - The proportional change in distance since last
 * emit.
 * @property {westures.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pull is defined as a single input moving away from or towards a pivot
 * point.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PullData
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 *    is recognized on the associated element.
 * @param {Object} [options]
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {string} [options.enableKeys=null] - One of 'altKey', 'ctrlKey',
 * 'metaKey', or 'shiftKey'. If set, gesture will only be recognized while this
 * key is down.
 * @param {number} [options.minInputs=1] The minimum number of inputs that
 * must be active for a Pull to be recognized.
 * @param {Element} [options.pivotCenter=true] - If set, the pull's pivot point
 * will be set to the center of the gesture's element.
 */
class Pull extends Pivotable {
  constructor(element, handler, options = {}) {
    const settings = { ...Pull.DEFAULTS, ...options };
    super('pull', element, handler, settings);

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
   * Update the previous data. Called by Pivotable.
   *
   * @private
   * @param {State} state - current input state.
   */
  updatePrevious(state) {
    this.previous = this.pivot.distanceTo(state.centroid);
  }

  /**
   * Event hook for the move of a Pull.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PullData} <tt>null</tt> if not recognized.
   */
  move(state) {
    const pivot = this.pivot;
    const distance = pivot.distanceTo(state.centroid);
    const scale = distance / this.previous;

    let rv = null;
    if (distance > this.deadzoneRadius && this.previous > this.deadzoneRadius) {
      rv = { distance, scale: this.outgoing.next(scale), pivot };
    }

    /*
     * Updating the previous distance regardless of emit prevents sudden changes
     * when the user exits the deadzone circle.
     */
    this.previous = distance;

    return rv;
  }
}

Pivotable.DEFAULTS = Object.freeze({
  ...Pivotable.DEFAULTS,
  smoothing: true,
});

module.exports = Pull;

