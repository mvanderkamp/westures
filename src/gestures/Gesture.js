/**
 * @file Gesture.js
 * Contains the Gesture class
 */

/**
 * The Gesture class that all gestures inherit from.
 */
class Gesture {
  /**
   * Constructor function for the Gesture class.
   * @class Gesture
   */
  constructor() {
    /**
     * The generic string type of gesture ('expand'|'pan'|'pinch'|'rotate'|'swipe'|'tap').
     * @type {String}
     */
    this.type = null;

    /**
     * The unique identifier for each gesture determined at bind time by the state object. This
     * allows for distinctions across instance variables of Gestures that are created on the fly
     * (e.g. Tap-1, Tap-2, etc).
     * @type {String|null}
     */
    this.id = null;
  }

  /**
   * Set the type of the gesture to be called during an event
   * @param {String} type - The unique identifier of the gesture being created.
   */
  setType(type) {
    this.type = type;
  }
  /*setId*/

  /**
   * getType() - Returns the generic type of the gesture
   * @returns {String} - The type of gesture
   */
  getType() {
    return this.type;
  }
  /*getType*/

  /**
   * Set the id of the gesture to be called during an event
   * @param {String} id - The unique identifier of the gesture being created.
   */
  setId(id) {
    this.id = id;
  }
  /*setId*/

  /**
   * Return the id of the event. If the id does not exist, return the type.
   * @return {String}
   */
  getId() {
    return (this.id !== null) ? this.id : this.type;
  }
  /*getId*/

  /**
   * Updates internal properties with new ones, only if the properties exist.
   * @param object
   */
  update(object) {

    for (var key in object) {
      if (this[key]) {
        this[key] = object[key];
      }
    }
  }

  //noinspection JSUnusedLocalSymbols
  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null|Object}  - Default of null
   */
  start(inputs) {
    return null;
  }
  /*start*/

  //noinspection JSUnusedLocalSymbols
  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @returns {null|Object} - Default of null
   */
  move(inputs, state) {
    return null;
  }
  /*move*/

  //noinspection JSUnusedLocalSymbols
  /**
   * end() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null|Object}  - Default of null
   */
  end(inputs) {
    return null;
  }
  /*end*/

}

export default Gesture;
