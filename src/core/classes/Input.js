/**
 * @file Input.js
 * Contains logic for the class Input
 */

import ZingEvent from './ZingEvent.js';
import util from './../util.js';

const DEFAULT_VELOCITY = 0;
/**
 * Tracks a single input and contains information about the current event, the previous event,
 * and various aggregated information about the input.
 * All inputs are destroyed on any touchend event.
 * @class Input
 */
class Input {
  constructor(event, touchIndex) {
    var event = new ZingEvent(event, touchIndex);

    //noinspection JSUnusedGlobalSymbols
    this.current = this.last = this.initial = event;

    //This index refers to the event.touches index.
    //noinspection JSUnusedGlobalSymbols
    this.index = (touchIndex) ? touchIndex : 0;

    this.velocity = DEFAULT_VELOCITY;
    this.progress = {}; //Storage for metadata of each gesture.
  }

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * @param {Event} event - The event object to wrap
   * @param touchIndex - The index of inputs (usually from event.touches)
   */
  update(event, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.last = this.current;
    this.current = new ZingEvent(event, touchIndex);
    this.velocity = this.calculateVelocity();
  }

  /*update*/

  /**
   * Stub to calculate the input's current velocity.
   * @returns {number|*}
   */
  calculateVelocity() {
    return this.velocity;
  }

  /*calculateVelocity*/

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
