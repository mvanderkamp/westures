/**
 * @file Contains the Rotate class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 2;

/**
 * @typedef RotateData
 * @type {Object}
 * @property {Number} delta - In radians, the change in angle since last emit.
 * @property {Point2D} pivot - The centroid of the currently active points.
 * @property {Number} pivot.x - x coordinate of centroid.
 * @property {Number} pivot.y - y coordinate of centroid.
 */

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor() {
    super('rotate');
  }

  /**
   * Store individual angle progress on each input, return average angle change.
   *
   * @private
   * @param {State} state - current input state.
   * @return {null}
   */
  getAngle(state) {
    let angle = 0;
    state.active.forEach( i => {
      const progress = i.getProgressOfGesture(this.id);
      const currentAngle = state.centroid.angleTo(i.current.point);
      angle += angularMinus(currentAngle, progress.previousAngle);
      progress.previousAngle = currentAngle;
    });
    angle /= (state.active.length);
    return angle;
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }

  /**
   * Event hook for the move of a Rotate gesture.
   *
   * @param {State} state - current input state.
   * @return {?RotateData} - null if this event did not occur
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    return {
      pivot: state.centroid,
      delta: this.getAngle(state),
    };
  }

  /**
   * Event hook for the end of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }
}

/*
 * Helper function to regulate angular differences, so they don't jump from 0 to
 * 2*PI or vice versa.
 */
const PI2 = 2 * Math.PI;
function angularMinus(a, b = 0) {
  let diff = a - b;
  if (diff < -Math.PI) {
    diff += PI2;
  } else if (diff > Math.PI) {
    diff -= PI2;
  }
  return diff;
}

module.exports = Rotate;

