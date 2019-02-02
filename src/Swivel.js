/**
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
 * @property {Number} delta - In radians, the change in angle since last emit.
 * @property {Point2D} pivot - The pivot point.
 * @property {Number} pivot.x - x coordinate of pivot.
 * @property {Number} pivot.y - y coordinate of pivot.
 * @property {Point2D} point - The current location of the input point.
 * @property {Number} point.x - x coordinate of point.
 * @property {Number} point.y - y coordinate of point.
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 * @see SwivelData
 */
class Swivel extends Gesture {
  /**
   * Constructor for the Swivel class.
   *
   * @param {Object} [options]
   * @param {Number} [options.deadzoneRadius=10] - The radius in pixels around
   *    the start point in which to do nothing.
   * @param {String} [options.enableKey=undefined] - One of 'altKey', 'ctrlKey',
   *    'metaKey', or 'shiftKey'. If set, gesture will only be recognized while
   *    this key is down.
   */
  constructor(options = {}) {
    super('swivel');

    /**
     * The radius around the start point in which to do nothing.
     */
    this.deadzoneRadius = options.deadzoneRadius || defaults.deadzoneRadius;

    /**
     * If this is set, gesture will only respond to events where this property
     * is truthy. Should be one of 'ctrlKey', 'altKey', or 'shiftKey'.
     */
    this.enableKey = options.enableKey;
  }

  /**
   * Returns whether this gesture is currently enabled.
   *
   * @private
   * @param {Event} event - The state's current input event.
   * @return {Boolean} true if the gesture is enabled, false otherwise.
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
   * @return {?SwivelData} - null if the gesture is not recognized.
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

