/*
 * Contains the Swipe class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const PROGRESS_STACK_SIZE = 5;

/**
 * Data returned when a Swipe is recognized.
 *
 * @typedef {Object} SwipeData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} velocity - The velocity of the swipe.
 * @property {number} direction - In radians, the direction of the swipe.
 * @property {westures.Point2D} point - The point at which the swipe ended.
 *
 * @memberof ReturnTypes
 */

/**
 * Calculates the angle of movement along a series of moves.
 *
 * @private
 * @see {@link https://en.wikipedia.org/wiki/Mean_of_circular_quantities}
 *
 * @param {{time: number, point: module:westures-core.Point2D}} moves - The
 * moves list to process.
 * @param {number} vlim - The number of moves to process.
 *
 * @return {number} The angle of the movement.
 */
function calc_angle(moves, vlim) {
  const point = moves[vlim].point;
  let sin = 0;
  let cos = 0;
  for (let i = 0; i < vlim; ++i) {
    const angle = moves[i].point.angleTo(point);
    sin += Math.sin(angle);
    cos += Math.cos(angle);
  }
  sin /= vlim;
  cos /= vlim;
  return Math.atan2(sin, cos);
}

/**
 * Local helper function for calculating the velocity between two timestamped
 * points.
 *
 * @private
 *
 * @param {object} start
 * @param {westures.Point2D} start.point
 * @param {number} start.time
 * @param {object} end
 * @param {westures.Point2D} end.point
 * @param {number} end.time
 *
 * @return {number} velocity from start to end point.
 */
function velocity(start, end) {
  const distance = end.point.distanceTo(start.point);
  const time = end.time - start.time + 1;
  return distance / time;
}

/**
 * Calculates the veloctiy of movement through a series of moves.
 *
 * @private
 * @param {{time: number, point: module:westures-core.Point2D}} moves - The
 * moves list to process.
 * @param {number} vlim - The number of moves to process.
 *
 * @return {number} The velocity of the moves.
 */
function calc_velocity(moves, vlim) {
  let sum = 0;
  for (let i = 0; i < vlim; ++i) {
    sum += velocity(moves[i], moves[i + 1]);
  }
  return sum / vlim;
}

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.SwipeData
 * @memberof westures
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
   */
  move(state) {
    if (state.active.length !== REQUIRED_INPUTS) return null;

    state.active.forEach(input => {
      const progress = input.getProgressOfGesture(this.id);
      if (!progress.moves) progress.moves = [];

      progress.moves.push({
        time:  Date.now(),
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
   * @return {?ReturnTypes.SwipeData} <tt>null</tt> if the gesture is not
   * recognized.
   */
  end(state) {
    const ended = state.getInputsInPhase('end');

    if (ended.length !== REQUIRED_INPUTS) return null;

    const progress = ended[0].getProgressOfGesture(this.id);
    const moves = progress.moves;
    if (!moves || moves.length < PROGRESS_STACK_SIZE) {
      return null;
    }

    const vlim = PROGRESS_STACK_SIZE - 1;
    const point = moves[vlim].point;
    const velocity = calc_velocity(moves, vlim);
    const direction = calc_angle(moves, vlim);

    return {
      point,
      velocity,
      direction,
    };
  }
}

module.exports = Swipe;

