/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const REQUIRED_INPUTS = 1;
const defaults = Object.freeze({
  deadzoneRadius: 15,
});

/**
 * Data returned when a Swivel is recognized.
 *
 * @typedef {Object} SwivelData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} delta - In radians, the change in angle since last emit.
 * @property {westures.Point2D} pivot - The pivot point.
 * @property {westures.Point2D} point - The current location of the input point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.SwivelData
 * @memberof westures
 */
class Swivel extends Gesture {
  /**
   * Constructor for the Swivel class.
   *
   * @param {Object} [options]
   * @param {number} [options.deadzoneRadius=10] - The radius in pixels around
   *    the start point in which to do nothing.
   * @param {string} [options.enableKey=undefined] - One of 'altKey', 'ctrlKey',
   *    'metaKey', or 'shiftKey'. If set, gesture will only be recognized while
   *    this key is down.
   * @param {Element} [options.pivotCenter] - If set, the swivel's pivot point
   *    will be set to the center of the given pivotCenter element. Otherwise,
   *    the pivot will be the location of the first contact point.
   */
  constructor(options = {}) {
    super('swivel');

    /**
     * The radius around the start point in which to do nothing.
     *
     * @private
     * @type {number}
     */
    this.deadzoneRadius = options.deadzoneRadius || defaults.deadzoneRadius;

    /**
     * If this is set, gesture will only respond to events where this property
     * is truthy. Should be one of 'ctrlKey', 'altKey', or 'shiftKey'.
     *
     * @private
     * @type {string}
     */
    this.enableKey = options.enableKey;

    /**
     * If this is set, the swivel will use the center of the element as its
     * pivot point. Unreliable if the element is moved during a swivel gesture.
     *
     * @private
     * @type {Element}
     */
    this.pivotCenter = options.pivotCenter;

    /**
     * The pivot point of the swivel.
     *
     * @private
     * @type {module:westures.Point2D}
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
  }

  /**
   * Refresh the gesture.
   *
   * @private
   * @param {module:westures.Input[]} inputs - Input list to process.
   * @param {State} state - current input state.
   */
  refresh(inputs, state) {
    if (inputs.length === REQUIRED_INPUTS && this.enabled(state.event)) {
      this.restart(state);
    }
  }

  /**
   * Event hook for the start of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.refresh(state.getInputsInPhase('start'), state);
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
    const point = state.centroid;
    const pivot = this.pivot;
    const angle = pivot.angleTo(point);
    const delta = angle - this.previous;

    /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */
    this.previous = angle;

    if (pivot.distanceTo(point) > this.deadzoneRadius) {
      return { delta, pivot, point };
    }
    return null;
  }

  /**
   * Event hook for the move of a Swivel gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.SwivelData} <tt>null</tt> if the gesture is not
   * recognized.
   */
  move(state) {
    if (state.active.length !== REQUIRED_INPUTS) return null;

    let output = null;
    if (this.enabled(state.event)) {
      if (this.isActive) {
        output = this.calculateOutput(state);
      } else {
        // The enableKey was just pressed again.
        this.refresh(state.active, state);
      }
    } else {
      // The enableKey was released, therefore pivot point is now invalid.
      this.isActive = false;
    }

    return output;
  }

  /**
   * Event hook for the end of a Swivel.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.refresh(state.active, state);
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

module.exports = Swivel;

