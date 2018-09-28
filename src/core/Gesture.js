/**
 * @file Gesture.js
 * Contains the Gesture class
 */

const util = require('./util.js');

let nextGestureNum = 0;

/**
 * The Gesture class that all gestures inherit from.
 */
class Gesture {
  /**
   * Constructor function for the Gesture class.
   * @class Gesture
   */
  constructor(type) {
    /**
     * The generic string type of gesture. (e.g. 'pan' or 'tap' or 'pinch').
     * @type {String}
     */
    if (typeof type === 'undefined') throw 'Gestures require a type!';
    this.type = type;

    /**
     * The unique identifier for each gesture determined at bind time by the
     * state object. This allows for distinctions across instance variables of
     * Gestures that are created on the fly (e.g. gesture-tap-1, gesture-tap-2).
     * @type {String}
     */
    this.id = `gesture-${this.type}-${nextGestureNum++}`;
  }

  /**
   * start() - Event hook for the start of a gesture
   *
   * @param {Object} state - The state object of the current region.
   *
   * @return {null|Object}  - Default of null
   */
  start(state) {
    return null;
  }

  /**
   * move() - Event hook for the move of a gesture
   *
   * @param {Object} state - The state object of the current region.
   *
   * @return {null|Object} - Default of null
   */
  move(state) {
    return null;
  }

  /**
   * end() - Event hook for the move of a gesture
   *
   * @param {Array} inputs - The array of Inputs on the screen
   *
   * @return {null|Object}  - Default of null
   */
  end(state) {
    return null;
  }
}

module.exports = Gesture;

