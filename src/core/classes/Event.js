'use strict';
import util from '../util.js';

/**
 * An event wrapper that normalizes browser differences
 */
class Event {
  constructor(ev) {
    this.originalEvent = ev;
    this.type = util.normalizeEvent(ev.type);
    this.clientX = event.clientX;
    this.clientY = event.clientY;
  }

}

export default Event;
