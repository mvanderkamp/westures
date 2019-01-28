/**
 * @file Swipe.js
 * Contains the Swipe class
 */

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
// const ESCAPE_VELOCITY = 4.5;
const PROGRESS_STACK_SIZE = 5;

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @class Swipe
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
   * @param {State} input status object
   *
   * @return {null} - Swipe does not emit from a move.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;

    state.active.forEach( input => {
      const progress = input.getProgressOfGesture(this.id);
      if (!progress.moves) progress.moves = [];

      progress.moves.push({
        time: Date.now(),
        point: input.cloneCurrentPoint(),
      });

      while (progress.moves.length > PROGRESS_STACK_SIZE) {
        progress.moves.shift();
      }
    });

    return null;
  }
  /* move*/

  /**
   * Determines if the input's history validates a swipe motion.
   *
   * @param {State} input status object
   *
   * @return {null|Object} - null if the gesture is not to be emitted, Object
   *    with information otherwise.
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
      x: point.x,
      y: point.y,
      velocity,
      direction,
    };
  }
  /* end*/
}

function calc_velocity(start, end) {
  const distance = end.point.distanceTo(start.point);
  const time = end.time - start.time;
  return distance / time;
}

module.exports = Swipe;

