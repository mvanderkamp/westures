/**
 * @file Rotate.js
 * Contains the Rotate class
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const REQUIRED_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @class Rotate
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
   * @param {State} input status object
   *
   * @return {null}
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }

  /**
   * Event hook for the move of a Rotate gesture.
   *
   * @param {State} input status object
   *
   * @return {null} - null if this event did not occur
   * @return {Object} obj.angle - The current angle along the unit circle
   * @return {Object} obj.pivot - The pivot point of the rotation
   * @return {Object} obj.delta - The change in angle since the last emitted
   *                              move.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    return {
      pivot: state.centroid,
      delta: this.getAngle(state),
    };
  }
  /* move*/

  /**
   * Event hook for the end of a gesture.
   *
   * @param {State} input status object
   *
   * @return {null}
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }
}

/**
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

