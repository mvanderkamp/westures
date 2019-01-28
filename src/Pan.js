/**
 * @file Pan.js
 * Contains the Pan class
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const DEFAULT_MIN_THRESHOLD = 1;
const REQUIRED_INPUTS = 1;

/**
 * A Pan is defined as a normal movement in any direction on a screen.
 *
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   *
   * @param {Object} [options] - The options object.
   * @param {Number} [options.threshold=1] - The minimum number of pixels the
   *    input has to move to trigger this gesture.
   * @param {String} [options.muteKey] - One of the keys reported by touch input
   *    events. If this key is pressed, this gesture will be muted.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * The minimum amount in pixels the pan must move until it is fired.
     *
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;

    /**
     * Don't emit any data if this key is pressed.
     *
     * @type {String}
     */
    this.muteKey = options.muteKey;
  }

  initialize(state) {
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.lastEmitted = state.centroid;
  }

  /**
   * Event hook for the start of a Pan gesture. Records the current centroid of
   * the inputs.
   *
   * @param {State} input status object
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }
  /* start */

  /**
   * move() - Event hook for the move of a gesture.  
   *
   * @param {State} input status object
   *
   * @return {Object} The change in position and the current position.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    if (this.muteKey && state.event[this.muteKey]) {
      this.initialize(state);
      return null;
    }

    const progress = state.active[0].getProgressOfGesture(this.id);
    const point = state.centroid;
    const change = point.minus(progress.lastEmitted);
    progress.lastEmitted = point;

    return { change, point };
  }
  /* move*/

  /**
   * end() - Event hook for the end of a gesture. 
   *
   * @param {State} input status object
   *
   * @return {null} 
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }
  /* end*/
}

module.exports = Pan;

