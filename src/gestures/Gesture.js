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
    this.id = null;
  }

  /**
   * getType() - Returns the type of the gesture
   * @returns {String} - The type of gesture
   */
  getType() {
    return this.type;
  }
  /*getType*/

  /**
   * Set the id of the gesture to be called during an event
   * @param {Number} id
   */
  setId(id) {
    this.id = id;
  }
  /*setId*/

  /**
   * Return the id of the event. If the id does not exist, return the type.
   * @return {string}
   */
  getId() {
    return (this.id) ? this.id : this.type;
  }
  /*getId*/

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null
   */
  start(inputs) {
    return null;
  }
  /*start*/

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null   */
  move(inputs) {
    return null;
  }
  /*move*/

  /**
   * end() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - Default of null
   */
  end(inputs) {
    return null;
  }
  /**/

}

export default Gesture;
