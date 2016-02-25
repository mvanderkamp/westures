import Event from './Event.js';

/**
 * Tracks a single input and contains information about the current event, the previous event,
 * and various aggregated information about the input.
 * All inputs are destroyed on any touchend event.
 */

const DEFAULT_VELOCITY = 0;
class Input {
  constructor(ev, touchIndex) {
    //noinspection JSClosureCompilerSyntax
    var event = new Event(ev, touchIndex);

    //noinspection JSUnusedGlobalSymbols
    this.current = this.initial = event;

    //This index refers to the event.touches index.
    this.index = (touchIndex) ? touchIndex : 0;

    //noinspection JSUnusedGlobalSymbols
    this.last = null;
    this.velocity = DEFAULT_VELOCITY;
    this.progress = {}; //Storage for metadata of each gesture.
  }

  /**
   * Receives an input, updates the internal state of what the input has done next.
   * //TODO : Should be handled by the browser, changed touches etc.
   */
  update(ev, touchIndex) {
    //noinspection JSUnusedGlobalSymbols
    this.last = this.current;

    //noinspection JSClosureCompilerSyntax
    this.current = new Event(ev, touchIndex);

    this.velocity = this.calculateVelocity();
  }

  calculateVelocity() {
    return this.velocity;
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
