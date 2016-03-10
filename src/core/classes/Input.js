/**
 * @file Input.js
 */

import ZingEvent from './ZingEvent.js';
import util from './../util.js';

/**
 * Tracks a single input and contains information about the current, previous, and initial events.
 * Contains the progress of each Input and it's associated gestures.
 * @class Input
 */
class Input {

  /**
   * Constructor function for the Input class.
   * @param {Event} event - The Event object from the window
   * @param {Number} [index=0] - The identifier for each input event
   * (taken from event.changedTouches)
   */
  constructor(event, index) {
    var currentEvent = new ZingEvent(event, index);

    /**
     * Holds the initial event object. A touchstart/mousedown event.
     * @type {ZingEvent}
     */
    this.initial = currentEvent;

    /**
     * Holds the most current event for this Input, disregarding any other past, current, and
     * future events that other Inputs participate in. e.g. This event ended in an 'end' event,
     * but another Input is still participating in events -- this will not be updated in such cases.
     * @type {ZingEvent}
     */
    this.current = currentEvent;

    /**
     * Holds the previous event that took place.
     * @type {ZingEvent}
     */
    this.previous = currentEvent;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Refers to the event.touches index, or 0 if a simple mouse event occurred.
     * @type {Number}
     */
    this.index = (index) ? index : 0;

    /**
     * Stores internal state between events for each gesture based off of the gesture's id.
     * @type {Object}
     */
    this.progress = {};
  }
  /*constructor*/

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * @param {Event} event - The event object to wrap with a ZingEvent.
   * @param {Number} touchIndex - The index of inputs (usually from event.touches)
   */
  update(event, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.previous = this.current;
    this.current = new ZingEvent(event, touchIndex);
  }
  /*update*/

  /**
   * Returns the progress of the specified gesture.
   * @param {String} id - The identifier for each unique Gesture's progress.
   * @returns {Object} - The progress of the gesture. Creates an empty object if no progress
   * has begun.
   */
  getGestureProgress(id) {
    if (!this.progress[id]) {
      this.progress[id] = {};
    }

    return this.progress[id];
  }
  /*getGestureProgress*/

  /**
   * Returns the normalized current Event's type.
   * @returns {String} The current event's type ( start | move | end )
   */
  getCurrentEventType() {
    return this.current.type;
  }
  /*getCurrentEventType*/

  /**
   * Resets a progress/state object of the specified gesture.
   * @param {String} id - The identifier of the specified gesture
   */
  resetProgress(id) {
    this.progress[id] = {};
  }
  /*resetProgress*/

}

export default Input;
