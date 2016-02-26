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
  constructor(ev, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.originalEvent = ev;
    this.type = util.normalizeEvent(ev.type);
    this.touches = [];

    if (touchIndex) {
      this.touches[touchIndex].clientX = ev.clientX;
      this.touches[touchIndex].clientY = ev.clientY;
    } else {
      this.clientX = ev.clientX;
      this.clientY = ev.clientY;
    }

  }

}

export default ZingEvent;
