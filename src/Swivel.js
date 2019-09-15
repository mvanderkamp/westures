/*
 * Contains the Rotate class.
 */

'use strict';

const { angularDifference, Smoothable } = require('westures-core');
const Pivotable = require('./Pivotable.js');

/**
 * Data returned when a Swivel is recognized.
 *
 * @typedef {Object} SwivelData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 * @property {westures.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends westures.Gesture
 * @see {ReturnTypes.SwivelData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {Object} [options]
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {string} [options.enableKeys=null] - One of 'altKey', 'ctrlKey',
 * 'metaKey', or 'shiftKey'. If set, gesture will only be recognized while this
 * key is down.
 * @param {number} [options.minInputs=1] - The minimum number of inputs that
 * must be active for a Swivel to be recognized.
 * @param {Element} [options.pivotCenter=true] - If set, the swivel's pivot
 * point will be set to the center of the gesture's element.
 */
class Swivel extends Pivotable {
  constructor(element, handler, options = {}) {
    const settings = { ...Swivel.DEFAULTS, ...options };
    super('swivel', element, handler, settings);

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
   * Update the previous data. Called by Pivotable.
   *
   * @private
   * @param {State} state - current input state.
   */
  updatePrevious(state) {
    this.previous = this.pivot.angleTo(state.centroid);
  }

  /**
   * Event hook for the move of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.SwivelData} <tt>null</tt> if the gesture is not
   * recognized.
   */
  move(state) {
    const pivot = this.pivot;
    const angle = pivot.angleTo(state.centroid);
    const rotation = angularDifference(angle, this.previous);

    /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */
    this.previous = angle;

    if (pivot.distanceTo(state.centroid) > this.deadzoneRadius) {
      return { rotation: this.outgoing.next(rotation), pivot };
    }
    return null;
  }
}

Swivel.DEFAULTS = Object.freeze({
  ...Pivotable.DEFAULTS,
});

module.exports = Swivel;

