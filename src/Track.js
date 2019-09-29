/*
 * Contains the Track class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Track is recognized.
 *
 * @typedef {Object} TrackData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D[]} active - Points currently in 'start' or 'move'
 *    phase.
 * @property {westures.Point2D} centroid - centroid of currently active points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.TrackData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {Object} [options]
 * @param {string[]} [options.phases=[]] Phases to recognize. Entries can be any
 * or all of 'start', 'move', 'end', and 'cancel'.
 */
class Track extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Track.DEFAULTS, ...options };
    super('track', element, handler, settings);

    this.trackStart  = settings.phases.includes('start');
    this.trackMove   = settings.phases.includes('move');
    this.trackEnd    = settings.phases.includes('end');
    this.trackCancel = settings.phases.includes('cancel');
  }

  /**
   * Filters out the state's data, down to what should be emitted.

   * @private
   * @param {State} state - current input state.
   * @return {ReturnTypes.TrackData}
   */
  data({ activePoints, centroid }) {
    return { active: activePoints, centroid };
  }

  /**
   * Event hook for the start of a Track gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  start(state) {
    return this.trackStart ? this.data(state) : null;
  }

  /**
   * Event hook for the move of a Track gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  move(state) {
    return this.trackMove ? this.data(state) : null;
  }

  /**
   * Event hook for the end of a Track gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  end(state) {
    return this.trackEnd ? this.data(state) : null;
  }

  /**
   * Event hook for the cancel of a Track gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  cancel(state) {
    return this.trackCancel ? this.data(state) : null;
  }
}

// Default settings.
Track.DEFAULTS = Object.freeze({
  phases: Object.freeze([]),
});

module.exports = Track;

