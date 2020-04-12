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
 * @property {westures-core.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pull is defined as a single input moving away from or towards a pivot
 * point.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PullData}
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
class Pull extends Pivotable {
  constructor(element, handler, options = {}) {
    super('pull', element, handler, options);

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */
    this.outgoing = new Smoothable({ ...options, identity: 1 });
  }

  updatePrevious(state) {
    this.previous = this.pivot.distanceTo(state.centroid);
  }

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

module.exports = Pull;

