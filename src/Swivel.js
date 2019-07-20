/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture, Point2D, Smoothable } = require('westures-core');
const angularMinus = require('./angularMinus.js');

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
 * @mixes westures.Smoothable
 * @see ReturnTypes.SwivelData
 * @memberof westures
 *
 * @param {Object} [options]
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {string} [options.enableKey=null] - One of 'altKey', 'ctrlKey',
 * 'metaKey', or 'shiftKey'. If set, gesture will only be recognized while this
 * key is down.
 * @param {number} [options.minInputs=1] - The minimum number of inputs that
 * must be active for a Swivel to be recognized.
 * @param {Element} [options.pivotCenter] - If set, the swivel's pivot point
 * will be set to the center of the given pivotCenter element. Otherwise, the
 * pivot will be the location of the first contact point.
 */
class Swivel extends Smoothable(Gesture) {
  constructor(options = {}) {
    const settings = { ...Swivel.DEFAULTS, ...options };
    super('swivel', settings);

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
     * The minimum number of inputs that must be active for a Swivel to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * If this is set, the swivel will use the center of the element as its
     * pivot point. Unreliable if the element is moved during a swivel gesture.
     *
     * @private
     * @type {Element}
     */
    this.pivotCenter = settings.pivotCenter;

    /**
     * The pivot point of the swivel.
     *
     * @private
     * @type {westures.Point2D}
     */
    this.pivot = null;

    /**
     * The previous angle.
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
        this.previous = this.pivot.angleTo(state.centroid);
      } else {
        this.pivot = state.centroid;
        this.previous = 0;
      }
      super.restart(state);
    }
  }

  /**
   * Event hook for the start of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Determine the data to emit. To be called once valid state for a swivel has
   * been assured, except for deadzone.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?Returns.SwivelData} Data to emit.
   */
  calculateOutput(state) {
    const pivot = this.pivot;
    const angle = pivot.angleTo(state.centroid);
    const rotation = angularMinus(angle, this.previous);

    /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */
    this.previous = angle;

    if (pivot.distanceTo(state.centroid) > this.deadzoneRadius) {
      return { rotation, pivot };
    }
    return null;
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
    if (state.active.length < this.minInputs) return null;

    if (this.enabled(state.event)) {
      if (this.isActive) {
        const output = this.calculateOutput(state);
        return output ? this.smooth(output, 'rotation') : null;
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
   * Event hook for the end of a Swivel.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Swivel.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.end(state);
  }
}

Swivel.DEFAULTS = Object.freeze({
  deadzoneRadius: 15,
  enableKey:      null,
  minInputs:      1,
  pivotCenter:    false,
});

module.exports = Swivel;

