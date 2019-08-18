/*
 * Contains the abstract Pull class.
 */

'use strict';

const { Gesture, Point2D, Smoothable } = require('westures-core');

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
 * @param {string} [options.enableKey=null] - One of 'altKey', 'ctrlKey',
 * 'metaKey', or 'shiftKey'. If set, gesture will only be recognized while this
 * key is down.
 * @param {number} [options.minInputs=1] The minimum number of inputs that
 * must be active for a Pull to be recognized.
 * @param {Element} [options.pivotCenter] - If set, the pull's pivot point will
 * be set to the center of the given pivotCenter element. Otherwise, the pivot
 * will be the location of the first contact point.
 */
class Pull extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Pull.DEFAULTS, ...options };
    super('pinch', element, handler, settings);

    /**
     * The radius around the start point in which to do nothing.
     *
     * @private
     * @type {number}
     */
    this.deadzoneRadius = settings.deadzoneRadius;

    /**
     * If this is set, the pull will use the center of the element as its pivot
     * point. Unreliable if the element is moved during a pull gesture.
     *
     * @private
     * @type {Element}
     */
    this.pivotCenter = settings.pivotCenter;

    /**
     * The pivot point of the pull.
     *
     * @private
     * @type {westures.Point2D}
     */
    this.pivot = null;

    /**
     * The previous distance.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

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
   * Restart the given progress object using the given input object.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    if (this.pivotCenter) {
      const rect = this.pivotCenter.getBoundingClientRect();
      this.pivot = new Point2D(
        rect.left + (rect.width / 2),
        rect.top + (rect.height / 2)
      );
      this.previous = this.pivot.distanceTo(state.centroid);
    } else {
      this.pivot = state.centroid;
      this.previous = 0;
    }
    this.outgoing.restart();
  }

  /**
   * Event hook for the start of a Pull.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
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

  /**
   * Event hook for the end of a Pull.
   *
   * @private
   * @param {State} input status object
   */
  end(state) {
    if (state.active.length > 0) {
      this.restart(state);
    } else {
      this.outgoing.restart();
    }
  }

  /**
   * Event hook for the cancel of a Pull.
   *
   * @private
   */
  cancel() {
    this.outgoing.restart();
  }
}

Pull.DEFAULTS = Object.freeze({
  deadzoneRadius: 15,
  minInputs:      1,
  pivotCenter:    false,
  smoothing:      true,
});

module.exports = Pull;

