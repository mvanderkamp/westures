import util from '../util.js';

/**
 * An event wrapper that normalizes browser differences
 */
class Event {
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

export default Event;
