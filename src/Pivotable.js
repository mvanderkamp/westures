/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture, Point2D, Smoothable } = require('westures-core');

/**
 * Data returned when a Pivotable is recognized.
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
 * Determine the center point of the given element's bounding client rectangle.
 *
 * @inner
 * @memberof westures.Pivotable
 *
 * @param {Element} element - The DOM element to analyze.
 * @return {westures-core.Point2D} - The center of the element's bounding client
 * rectangle.
 */
function getClientCenter(element) {
  const rect = element.getBoundingClientRect();
  return new Point2D(
    rect.left + (rect.width / 2),
    rect.top + (rect.height / 2),
  );
}

/**
 * A Pivotable is a single input rotating around a fixed point. The fixed point
 * is determined by the input's location at its 'start' phase.
 *
 * @extends westures.Gesture
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
class Pivotable extends Gesture {
  constructor(type = 'pivotable', element, handler, options = {}) {
    super(type, element, handler, options);

    /**
     * The radius around the start point in which to do nothing.
     *
     * @type {number}
     */
    this.deadzoneRadius = options.deadzoneRadius;

    /**
     * Normally the center point of the gesture's element is used as the pivot.
     * If this option is set, the initial contact point with the element is used
     * as the pivot instead.
     *
     * @type {boolean}
     */
    this.dynamicPivot = options.dynamicPivot;

    /**
     * The pivot point of the pivotable.
     *
     * @type {westures-core.Point2D}
     */
    this.pivot = null;

    /**
     * The previous data.
     *
     * @type {number}
     */
    this.previous = 0;

    /**
     * The outgoing data.
     *
     * @type {westures-core.Smoothable}
     */
    this.outgoing = new Smoothable(options);
  }

  /**
   * Updates the previous data. It will be called during the 'start' and 'end'
   * phases, and should also be called during the 'move' phase implemented by
   * the subclass.
   *
   * @abstract
   * @param {State} state - the current input state.
   */
  updatePrevious() {
    throw 'Gestures which extend Pivotable must implement updatePrevious()';
  }

  /**
   * Restart the given progress object using the given input object.
   *
   * @param {State} state - current input state.
   */
  restart(state) {
    if (this.dynamicPivot) {
      this.pivot = state.centroid;
      this.previous = 0;
    } else {
      this.pivot = getClientCenter(this.element);
      this.updatePrevious(state);
    }
    this.outgoing.restart();
  }

  start(state) {
    this.restart(state);
  }

  end(state) {
    if (state.active.length > 0) {
      this.restart(state);
    } else {
      this.outgoing.restart();
    }
  }

  cancel() {
    this.outgoing.restart();
  }
}

Pivotable.DEFAULTS = Object.freeze({
  deadzoneRadius: 15,
  dynamicPivot:   false,
});

Pivotable.getClientCenter = getClientCenter;

module.exports = Pivotable;

