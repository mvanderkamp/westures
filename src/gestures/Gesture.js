/**
 * @file Gesture.js
 * Contains the Gesture class
 */

/**
 * Gesture object detailing Tap functionality.
 * @class Tap
 * @extends Gesture
 */
class Gesture {
  constructor() {
    this.type = null;
  }

  /**
   * getType() - Returns the type of the gesture
   * @returns {String} - The type of gesture
   */
  getType() {
    return this.type;
  }/*getType*/

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null
   */
  start(inputs) {
    return null;
  }/*start*/

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null   */
  move(inputs) {
    return null;
  }/*move*/

  /**
   * endinputs() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null
   */
  end(inputs) {
    return null;
  }/*end*/

}

export default Gesture;
