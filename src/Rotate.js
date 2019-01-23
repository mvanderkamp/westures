/**
 * @file Rotate.js
 * Contains the Rotate class
 */

const { Gesture } = require('westures-core');

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
   * Initialize the progress of the gesture.
   *
   * @param {State} input status object
   */
  initializeProgress(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length < REQUIRED_INPUTS) return null;

    // Progress is stored on the first active input.

    const angle = active[0].currentAngleTo(active[1]);
    const progress = active[0].getProgressOfGesture(this.id);
    progress.previousAngle = angle;

    // let angle
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @param {State} input status object
   *
   * @return {null}
   */
  start(state) {
    this.initializeProgress(state);
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
    const active = state.getInputsNotInPhase('end');
    if (active.length < REQUIRED_INPUTS) return null;

    const pivot = active[0].currentMidpointTo(active[1]);
    const angle = active[0].currentAngleTo(active[1]);

    const progress = active[0].getProgressOfGesture(this.id);
    const delta = angularMinus(angle, progress.previousAngle);
    progress.previousAngle = angle;

    return {
      angle,
      pivot,
      delta,
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
    this.initializeProgress(state);
  }
}

const PI2 = 2 * Math.PI;
function angularMinus(a, b) {
  let diff = a - b;
  if (diff < -Math.PI) {
    diff += PI2;
  } else if (diff > Math.PI) {
    diff -= PI2;
  }
  return diff;
}

module.exports = Rotate;

