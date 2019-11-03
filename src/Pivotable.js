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
 * Determine the center point of the given element's bounding client rectangle.
 *
 * @inner
 * @memberof westures.Pivotable
 *
 * @param {Element} element - The DOM element to analyze.
 * @return {westures.Point2D} - The center of the element's bounding client
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
 * @param {Object} [options]
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {string} [options.enableKeys=null] - One of 'altKey', 'ctrlKey',
 * 'metaKey', or 'shiftKey'. If set, gesture will only be recognized while this
 * key is down.
 * @param {number} [options.minInputs=1] - The minimum number of inputs that
 * must be active for a Pivotable to be recognized.
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
     * @private
     * @type {number}
     */
    this.deadzoneRadius = options.deadzoneRadius;

    /**
     * Normally the center point of the gesture's element is used as the pivot.
     * If this option is set, the initial contact point with the element is used
     * as the pivot instead.
     *
     * @private
     * @type {boolean}
     */
    this.dynamicPivot = options.dynamicPivot;

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
   * Subclasses shoudl implement this method for updating the 'previous' data.
   * It will be called during the 'start' and 'end' phases, and should also be
   * called during the 'move' phase implemented by the subclass.
   *
   * @param {State} state - the current input state.
   */
  updatePrevious() {}

  /**
   * Restart the given progress object using the given input object.
   *
   * @private
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
  dynamicPivot:   false,
});

Pivotable.getClientCenter = getClientCenter;

module.exports = Pivotable;

