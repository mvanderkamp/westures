/**
 * @file Input.js
 * Contains logic for the class Input
 */

import ZingEvent from './ZingEvent.js';
import util from './../util.js';

/**
 * Tracks a single input and contains information about the current event, the previous event,
 * and various aggregated information about the input.
 * All inputs are destroyed on any touchend event.
 * @class Input
 */
class Input {

  /**
   * Constructor for the Input class.
   * @param {Event} currentEvent - The Event object from the window
   * @param {Number} touchIndex - The index which
   */
  constructor(currentEvent, touchIndex) {
    var event = new ZingEvent(currentEvent, touchIndex);

    /**
     * Holds the initial event object. A touchstart/mousedown event.
     * @type {ZingEvent}
     */
    this.initial = event;

    /**
     * Holds the current event taking place
     * @type {ZingEvent}
     */
    this.current = event;

    /**
     * Holds the previous event that took place
     * @type {ZingEvent}
     */
    this.last = event;

    /**
     * Refers to the event.touches index, or 0 if a simple mouse event occurred.
     * @type {Number}
     */
    this.index = (touchIndex) ? touchIndex : 0;

    /**
     * Stores metadata for each gesture using each gesture's uid.
     * @type {Object}
     */
    this.progress = {}; //Storage for metadata of each gesture.
  }
  /*constructor*/

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * @param {Event} event - The event object to wrap
   * @param touchIndex - The index of inputs (usually from event.touches)
   */
  update(event, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.last = this.current;
    this.current = new ZingEvent(event, touchIndex);
  }
  /*update*/

  /**
   * Returns the progress/state object of the specified gesture
   * @param {String} type - The key for a gesture
   * @return {Object} - The progress of the gesture. Creates an empty object if no progress has begun.
   */
  getGestureProgress(type) {
    if (!this.progress[type]) {
      this.progress[type] = {};
    }

    return this.progress[type];
  }
  /*getGestureProgress*/

  /**
   * Returns the normalized current event type.
   * @returns {string}
   */
  getCurrentEventType() {
    return this.current.type;
  }
  /*getCurrentEventType*/

  /**
   * Resets a progress/state object of the specified gesture.
   * @param type
   */
  resetProgress(type) {
    this.progress[type] = {};
  }
  /*resetProgress*/

}

export default Input;
