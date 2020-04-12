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
 * @property {westures-core.Point2D[]} active - Points currently in 'start' or
 *    'move' phase.
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
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
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

   * @param {State} state - current input state.
   * @return {ReturnTypes.TrackData}
   */
  data({ activePoints }) {
    return { active: activePoints };
  }

  start(state) {
    return this.trackStart ? this.data(state) : null;
  }

  move(state) {
    return this.trackMove ? this.data(state) : null;
  }

  end(state) {
    return this.trackEnd ? this.data(state) : null;
  }

  cancel(state) {
    return this.trackCancel ? this.data(state) : null;
  }
}

// Default settings.
Track.DEFAULTS = Object.freeze({
  phases: Object.freeze([]),
});

module.exports = Track;

