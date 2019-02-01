/**
 * @file Contains the Pan class.
 */

'use strict';

const { Gesture } = require('westures-core');

const DEFAULT_MIN_THRESHOLD = 1;
const REQUIRED_INPUTS = 1;

/**
 * @typedef PanData
 * @type {Object}
 * @property {Point2D} change - The change vector from the last emit.
 * @property {Number} change.x - movement along x axis.
 * @property {Number} change.y - movement along y axis.
 * @property {Point2D} point - The centroid of the currently active points.
 * @property {Number} point.x - x coordinate of centroid.
 * @property {Number} point.y - y coordinate of centroid.
 */

/**
 * A Pan is defined as a normal movement in any direction. 
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Pan extends Gesture {
  /**
   * @param {Object} [options]
   * @param {String} [options.muteKey=undefined] - If this key is pressed, this
   *    gesture will be muted (i.e. not recognized). One of 'altKey', 'ctrlKey',
   *    'shiftKey', or 'metaKey'.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * Don't emit any data if this key is pressed.
     *
     * @type {String}
     */
    this.muteKey = options.muteKey;
  }

  /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @private
   * @param {State} state - The state object received by a hook.
   */
  initialize(state) {
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.lastEmitted = state.centroid;
  }

  /**
   * Event hook for the start of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }

  /**
   * Event hook for the move of a Pan.
   *
   * @param {State} state - current input state.
   * @return {?PanData} `null` if the gesture is muted by the muteKey,
   *    otherwise returns a data object.
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

  /**
   * Event hook for the end of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined} 
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }
}

module.exports = Pan;

