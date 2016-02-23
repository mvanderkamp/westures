import Event from './Event.js';

var ACTIVE_TOLERANCE = 100;
var id = 0;
/**
 * Hold important input information.
 */
class Input {
  constructor(ev) {
    var event = new Event(ev);
    this.current = this.initial = event;
    this.id = id++;

    //this.history = [event]; //A history of events. Useful for calculating momentum. (Might only need previous state?).
    this.last = null;
  }

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * Returns true if the input is active, false if inactive
   */
  update(ev) {
    if (this.current) {

      this.last = this.current;
      this.current = null;

      //TODO: Determine if this input participated in this event. For multi-touch/user
      if (ev.clientX <= this.last.clientX + ACTIVE_TOLERANCE &&
        ev.clientX >= this.last.clientX - ACTIVE_TOLERANCE &&
        ev.clientY <= this.last.clientY + ACTIVE_TOLERANCE &&
        ev.clientY >= this.last.clientY - ACTIVE_TOLERANCE
      ) {
        this.current = new Event(ev);
        return true;
      }
    }

    return false;
  }
}

export default Input;
