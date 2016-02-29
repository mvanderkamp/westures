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
    this.touches = {};

    if (touchIndex) {
      if (!this.touches[touchIndex]) {
        this.touches[touchIndex] = {
          clientX: ev.touches[touchIndex].clientX,
          clientY: ev.touches[touchIndex].clientY
        };
      }
    } else {
      this.clientX = ev.clientX;
      this.clientY = ev.clientY;
    }

  }

}

export default ZingEvent;
