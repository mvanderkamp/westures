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
 * @mixes westures.Smoothable
 * @see ReturnTypes.PullData
 * @memberof westures
 *
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
class Pull extends Smoothable(Gesture) {
  constructor(options = {}) {
    const settings = { ...Pull.DEFAULTS, ...options };
    super('pinch', settings);

    /**
     * The radius around the start point in which to do nothing.
     *
     * @private
     * @type {number}
     */
    this.deadzoneRadius = settings.deadzoneRadius;

    /**
     * If this is set, gesture will only respond to events where this property
     * is truthy. Should be one of 'ctrlKey', 'altKey', or 'shiftKey'.
     *
     * @private
     * @type {string}
     */
    this.enableKey = settings.enableKey;

    /**
     * The minimum number of inputs that must be active for a Pull to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

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

    /**
     * Whether the swivel is active.
     *
     * @private
     * @type {boolean}
     */
    this.isActive = false;

    /*
     * The "identity" value for this smoothable gesture.
     *
     * @private
     * @override
     * @type {number}
     */
    this.identity = 1;
  }

  /**
   * Returns whether this gesture is currently enabled.
   *
   * @private
   * @param {Event} event - The state's current input event.
   * @return {boolean} true if the gesture is enabled, false otherwise.
   */
  enabled(event) {
    return !this.enableKey || event[this.enableKey];
  }

  /**
   * Restart the given progress object using the given input object.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    if (state.active.length >= this.minInputs && this.enabled(state.event)) {
      this.isActive = true;
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
      super.restart(state);
    }
  }

  /**
   * Determine the data to emit. To be called once valid state for a pull has
   * been assured, except for deadzone.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?Returns.PullData} Data to emit.
   */
  calculateOutput(state) {
    const pivot = this.pivot;
    const distance = pivot.distanceTo(state.centroid);
    const scale = distance / this.previous;

    let returnValue = null
    if (distance > this.deadzoneRadius && this.previous > this.deadzoneRadius) {
      returnValue = { distance, scale, pivot };
    }

    /*
     * Updating the previous distance regardless of emit prevents sudden changes
     * when the user exits the deadzone circle.
     */
    this.previous = distance;

    return returnValue;
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
    if (state.active.length < this.minInputs) return null;

    if (this.enabled(state.event)) {
      if (this.isActive) {
        const output = this.calculateOutput(state);
        return output ? this.smooth(output, 'scale') : null;
      }

      // The enableKey was just pressed again.
      this.restart(state);
    } else {
      // The enableKey was released, therefore pivot point is now invalid.
      this.isActive = false;
    }

    return null;
  }

  /**
   * Event hook for the end of a Pull.
   *
   * @private
   * @param {State} input status object
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Pull.
   *
   * @private
   * @param {State} input status object
   */
  cancel(state) {
    this.restart(state);
  }
}

Pull.DEFAULTS = Object.freeze({
  deadzoneRadius: 15,
  enableKey:      null,
  minInputs:      1,
  pivotCenter:    false,
  smoothing:      true,
});

module.exports = Pull;

