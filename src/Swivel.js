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
 * @property {westures-core.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.SwivelData}
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
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {Element} [options.dynamicPivot=false] - Normally the center point of
 * the gesture's element is used as the pivot. If this option is set, the
 * initial contact point with the element is used as the pivot instead.
 */
class Swivel extends Pivotable {
  constructor(element, handler, options = {}) {
    super('swivel', element, handler, options);

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable(options);
  }

  updatePrevious(state) {
    this.previous = this.pivot.angleTo(state.centroid);
  }

  move(state) {
    const pivot = this.pivot;
    const angle = pivot.angleTo(state.centroid);
    const rotation = angularDifference(angle, this.previous);

    let rv = null;
    if (pivot.distanceTo(state.centroid) > this.deadzoneRadius) {
      rv = { rotation: this.outgoing.next(rotation), pivot };
    }

    /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */
    this.previous = angle;

    return rv;
  }
}

module.exports = Swivel;

