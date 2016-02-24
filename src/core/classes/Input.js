import Event from './Event.js';

/**
 * Tracks a single input and contains information about the current event, the previous event,
 * and various aggregated information about the input.
 * All inputs are destroyed on any touchend event.
 */
class Input {
  constructor(ev, touchIndex) {
    var event = new Event(ev, touchIndex);
    this.current = this.initial = event;
    this.index = (touchIndex) ? touchIndex : 0; //This index refers to the event.touches index.
    this.last = null;
    this.velocity = 0;
    this.progress = {}; //Storage for metadata of each gesture.
  }

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * //TODO : Should be handled by the browser, changed touches etc.
   */
  update(ev, touchIndex) {
    this.last = this.current;
    this.current = new Event(ev, touchIndex);

    //this.index //should never have to change this based upon the touchend/reset principle
    this.velocity = this.calculateVelocity();
  }

  calculateVelocity() {
    return 0;
  }

  /**
   * Returns the progress of the specified gesture
   * @param type
   */
  getGestureProgress(type) {
    if (!this.progress[type]) {
      this.progress[type] = {};
    }

    return this.progress[type];
  }

  resetProgress(type) {
    this.progress[type] = {};
  }
}

export default Input;
