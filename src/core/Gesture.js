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
     * Gestures that are created on the fly (e.g. Tap-1, Tap-2, etc).
     * @type {String|null}
     */
    this.id = `gesture-${this.type}-${nextGestureNum++}`;
  }

  /**
   * Updates internal properties with new ones, only if the properties exist.
   * @param {Object} object
   */
  update(object) {
    Object.keys(object).forEach( key => {
      this[key] = object[key];
    });
  }

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null|Object}  - Default of null
   */
  start(inputs, state) {
    return null;
  }

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null|Object} - Default of null
   */
  move(inputs, state) {
    return null;
  }

  /**
   * end() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @return {null|Object}  - Default of null
   */
  end(inputs) {
    return null;
  }
}

module.exports = Gesture;
