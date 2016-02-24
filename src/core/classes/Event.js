'use strict';
import util from '../util.js';

/**
 * An event wrapper that normalizes browser differences
 */
class Event {
  constructor(ev, touchIdx) {
    this.originalEvent = ev;
    this.type = util.normalizeEvent(ev.type);

    if (touchIdx) {
      this.touches[touchIdx].clientX = ev.clientX;
      this.touches[touchIdx].clientY = ev.clientY;
    } else {
      this.clientX = ev.clientX;
      this.clientY = ev.clientY;
    }

  }

}

export default Event;
