/*
 * Contains the Swipe class.
 */

'use strict';

const { Gesture } = require('../core');

const PROGRESS_STACK_SIZE = 7;
const MS_THRESHOLD = 300;

/**
 * Data returned when a Swipe is recognized.
 *
 * @typedef {Object} SwipeData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} velocity - The velocity of the swipe.
 * @property {number} direction - In radians, the direction of the swipe.
 * @property {westures-core.Point2D} point - The point at which the swipe ended.
 * @property {number} time - The epoch time, in ms, when the swipe ended.
 *
 * @memberof ReturnTypes
 */

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.SwipeData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 */
class Swipe extends Gesture {
  constructor(element, handler, options = {}) {
    super('swipe', element, handler, options);

    /**
     * Moves list.
     *
     * @type {object[]}
     */
    this.moves = [];

    /**
     * Data to emit when all points have ended.
     *
     * @type {ReturnTypes.SwipeData}
     */
    this.saved = null;
  }

  /**
   * Restart the swipe state for a new numper of inputs.
   */
  restart() {
    this.moves = [];
    this.saved = null;
  }

  start() {
    this.restart();
  }

  move(state) {
    this.moves.push({
      time:  Date.now(),
      point: state.centroid,
    });

    if (this.moves.length > PROGRESS_STACK_SIZE) {
      this.moves.splice(0, this.moves.length - PROGRESS_STACK_SIZE);
    }
  }

  end(state) {
    const result = this.getResult();
    this.moves = [];

    if (state.active.length > 0) {
      this.saved = result;
      return null;
    }

    this.saved = null;
    return Swipe.validate(result);
  }

  cancel() {
    this.restart();
  }

  /**
   * Get the swipe result.
   *
   * @returns {?ReturnTypes.SwipeData}
   */
  getResult() {
    if (this.moves.length < PROGRESS_STACK_SIZE) {
      return this.saved;
    }
    const vlim = PROGRESS_STACK_SIZE - 1;
    const { point, time } = this.moves[vlim];
    const velocity = Swipe.calc_velocity(this.moves, vlim);
    const direction = Swipe.calc_angle(this.moves, vlim);
    const centroid = point;
    return { point, velocity, direction, time, centroid };
  }

  /**
   * Validates that an emit should occur with the given data.
   *
   * @static
   * @param {?ReturnTypes.SwipeData} data
   * @returns {?ReturnTypes.SwipeData}
   */
  static validate(data) {
    if (data == null) return null;
    return (Date.now() - data.time > MS_THRESHOLD) ? null : data;
  }

  /**
   * Calculates the angle of movement along a series of moves.
   *
   * @static
   * @see {@link https://en.wikipedia.org/wiki/Mean_of_circular_quantities}
   *
   * @param {{time: number, point: westures-core.Point2D}} moves - The moves
   * list to process.
   * @param {number} vlim - The number of moves to process.
   *
   * @return {number} The angle of the movement.
   */
  static calc_angle(moves, vlim) {
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
   * @static
   * @param {object} start
   * @param {westures-core.Point2D} start.point
   * @param {number} start.time
   * @param {object} end
   * @param {westures-core.Point2D} end.point
   * @param {number} end.time
   *
   * @return {number} velocity from start to end point.
   */
  static velocity(start, end) {
    const distance = end.point.distanceTo(start.point);
    const time = end.time - start.time + 1;
    return distance / time;
  }

  /**
   * Calculates the veloctiy of movement through a series of moves.
   *
   * @static
   * @param {{time: number, point: westures-core.Point2D}} moves - The moves
   * list to process.
   * @param {number} vlim - The number of moves to process.
   *
   * @return {number} The velocity of the moves.
   */
  static calc_velocity(moves, vlim) {
    let max = 0;
    for (let i = 0; i < vlim; ++i) {
      const current = Swipe.velocity(moves[i], moves[i + 1]);
      if (current > max) max = current;
    }
    return max;
  }
}

module.exports = Swipe;

