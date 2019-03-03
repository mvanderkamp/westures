/*
 * Contains the Pan class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;

/**
 * Data returned when a Pan is recognized.
 *
 * @typedef {Object} PanData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D} change - The change vector from the last emit.
 * @property {westures.Point2D} point - The centroid of the currently active
 *    points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pan is defined as a normal movement in any direction.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PanData
 * @memberof westures
 */
class Pan extends Gesture {
  /**
   * @param {Object} [options]
   * @param {string} [options.muteKey=undefined] - If this key is pressed, this
   *    gesture will be muted (i.e. not recognized). One of 'altKey', 'ctrlKey',
   *    'shiftKey', or 'metaKey'.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * Don't emit any data if this key is pressed.
     *
     * @private
     * @type {string}
     */
    this.muteKey = options.muteKey;

    /**
     * The previous point location.
     *
     * @private
     * @type {module:westures.Point2D}
     */
    this.previous = null;
  }

  /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @private
   * @param {State} state - The state object received by a hook.
   */
  refresh(state) {
    if (state.active.length >= REQUIRED_INPUTS) {
      this.previous = state.centroid;
    }
  }

  /**
   * Event hook for the start of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.refresh(state);
  }

  /**
   * Event hook for the move of a Pan.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PanData} <tt>null</tt> if the gesture was muted or
   * otherwise not recognized.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) {
      return null;
    }

    if (this.muteKey && state.event[this.muteKey]) {
      this.refresh(state);
      return null;
    }

    const point = state.centroid;
    const change = point.minus(this.previous);
    this.previous = point;

    return { change, point };
  }

  /**
   * Event hook for the end of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.refresh(state);
  }

  /**
   * Event hook for the cancel of a Pan. Resets the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.refresh(state);
  }
}

module.exports = Pan;

