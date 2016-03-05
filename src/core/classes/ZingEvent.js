/**
 * @file ZingEvent.js
 * Contains logic for ZingEvents
 */

import util from '../util.js';

/**
 * An event wrapper that normalizes events across browsers and input devices
 * @class ZingEvent
 */
class ZingEvent {
  /**
   * @constructor
   * @param {Event} event - The event object being wrapped
   * @param {Object} event.changedTouches - The TouchList representing points that participated in the event
   * @param {Number} touchIndex - The index of touch if applicable
   */
  constructor(event, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.originalEvent = event;
    this.type = util.normalizeEvent(event.type);

    //TODO: Normalize this better...
    if (event.touches) {
      if (event.touches[touchIndex]) {
        this.x = event.touches[touchIndex].clientX;
        this.y = event.touches[touchIndex].clientY;
      } else if (event.changedTouches) {
        for (var i = 0; i < event.changedTouches.length; i++) {
          if (event.changedTouches[i].identifier === touchIndex) {
            this.x = event.changedTouches[i].clientX;
            this.y = event.changedTouches[i].clientY;
          }
        }
      }
    } else {
      this.x = event.clientX;
      this.y = event.clientY;
    }
  }
}

export default ZingEvent;
