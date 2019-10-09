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
 * @property {westures.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pivotable is a single input rotating around a fixed point. The fixed point
 * is determined by the input's location at its 'start' phase.
 *
 * @extends westures-core.Gesture
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
 * must be active for a Pivotable to be recognized.
 * @param {Element} [options.pivotCenter=true] - If set, the pivotable's pivot
 * point will be set to the center of the gesture's element.
 */
class Pivotable extends Gesture {
  constructor(type = 'pivotable', element, handler, options = {}) {
    super(type, element, handler, options);

    /**
     * The radius around the start point in which to do nothing.
     *
     * @private
     * @type {number}
     */
    this.deadzoneRadius = options.deadzoneRadius;

    /**
     * If this is set, the pivotable will use the center of the element as its
     * pivot point. Unreliable if the element is moved during a pivotable
     * gesture.
     *
     * @private
     * @type {Element}
     */
    this.pivotCenter = options.pivotCenter;

    /**
     * The pivot point of the pivotable.
     *
     * @private
     * @type {westures.Point2D}
     */
    this.pivot = null;

    /**
     * The previous data.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

    /**
     * The outgoing data.
     *
     * @private
     * @type {westures-core.Smoothable}
     */
    this.outgoing = new Smoothable(options);
  }

  /**
   * Restart the given progress object using the given input object.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    if (this.pivotCenter) {
      const rect = this.element.getBoundingClientRect();
      this.pivot = new Point2D(
        rect.left + (rect.width / 2),
        rect.top + (rect.height / 2)
      );
      this.updatePrevious(state);
    } else {
      this.pivot = state.centroid;
      this.previous = 0;
    }
    this.outgoing.restart();
  }

  /**
   * Event hook for the start of a Pivotable gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the end of a Pivotable.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    if (state.active.length > 0) {
      this.restart(state);
    } else {
      this.outgoing.restart();
    }
  }

  /**
   * Event hook for the cancel of a Pivotable.
   *
   * @private
   */
  cancel() {
    this.outgoing.restart();
  }
}

Pivotable.DEFAULTS = Object.freeze({
  deadzoneRadius: 15,
  minInputs:      1,
  pivotCenter:    true,
});

module.exports = Pivotable;

