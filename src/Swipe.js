/*
 * Contains the Swipe class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const PROGRESS_STACK_SIZE = 5;

/**
 * @typedef SwipeData
 * @type {Object}
 * @property {number} velocity - The velocity of the swipe.
 * @property {number} direction - In radians, the direction of the swipe.
 * @property {Point2D} point - The point at which the swipe ended.
 * @property {Event} event - The input event which caused the gesture to be
 *    recognized.
 * @property {string} phase - 'start', 'move', or 'end'.
 * @property {string} type - The name of the gesture as specified by its
 *    designer.
 */

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends Gesture 
 * @see SwipeData
 */
class Swipe extends Gesture {
  /**
   * Constructor function for the Swipe class.
   */
  constructor() {
    super('swipe');
  }

  /**
   * Event hook for the move of a gesture. Captures an input's x/y coordinates
   * and the time of it's event on a stack.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;

    state.active.forEach( input => {
      const progress = input.getProgressOfGesture(this.id);
      if (!progress.moves) progress.moves = [];

      progress.moves.push({
        time: Date.now(),
        point: input.current.point,
      });

      while (progress.moves.length > PROGRESS_STACK_SIZE) {
        progress.moves.shift();
      }
    });

    return null;
  }

  /**
   * Determines if the input's history validates a swipe motion.
   *
   * @param {State} state - current input state.
   * @return {?SwipeData} <tt>null</tt> if the gesture is not recognized.
   */
  end(state) {
    const ended = state.getInputsInPhase('end');

    if (ended.length !== REQUIRED_INPUTS) return null;

    const progress = ended[0].getProgressOfGesture(this.id);
    if (!progress.moves || progress.moves.length < PROGRESS_STACK_SIZE) {
      return null;
    }
    const moves = progress.moves;

    const vlim = PROGRESS_STACK_SIZE - 1;
    const point = moves[vlim].point;
    const velos = [];
    let direction = 0;
    for (let i = 0; i < vlim; ++i) {
      velos[i] = calc_velocity(moves[i], moves[i + 1]);
      direction += moves[i].point.angleTo(point);
    }
    direction /= vlim;

    const velocity = velos.reduce((acc,cur) => cur > acc ? cur : acc);

    return {
      point,
      velocity,
      direction,
    };
  }
}

/*
 * Local helper function for calculating the velocity between two timestamped
 * points.
 */
function calc_velocity(start, end) {
  const distance = end.point.distanceTo(start.point);
  const time = end.time - start.time;
  return distance / time;
}

module.exports = Swipe;

