/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const defaults = Object.freeze({
  deadzoneRadius: 10,
});

/**
 * @typedef SwivelData
 * @type {Object}
 * @property {number} delta - In radians, the change in angle since last emit.
 * @property {Point2D} pivot - The pivot point.
 * @property {Point2D} point - The current location of the input point.
 * @property {Event} event - The input event which caused the gesture to be
 *    recognized.
 * @property {string} phase - 'start', 'move', or 'end'.
 * @property {string} type - The name of the gesture as specified by its
 *    designer.
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
   * Event hook for the start of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (!this.enabled(state.event)) return null;

    const started = state.getInputsInPhase('start');
    if (started.length !== REQUIRED_INPUTS) return null;

    const progress = started[0].getProgressOfGesture(this.id);
    progress.pivot = started[0].current.point;
    progress.previousAngle = 0;
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

    const input = state.active[0];

    const progress = input.getProgressOfGesture(this.id);
    if (this.enabled(state.event)) {
      if (!progress.pivot) {
        // Restart: enableKey was just pressed again.
        progress.pivot = input.current.point;
        progress.previousAngle = 0;
        return null;
      }

      const point = input.current.point;
      const pivot = progress.pivot;
      const angle = pivot.angleTo(point);
      const delta = angle - progress.previousAngle;
      progress.previousAngle = angle;

      if (pivot.distanceTo(point) <= this.deadzoneRadius) {
        return null;
      } else {
        return { delta, pivot, point };
      }
    } else {
      // CTRL key was released, therefore pivot point is now invalid.
      delete progress.pivot;
    }
  }
}

module.exports = Swivel;

