/**
 * @file Contains the Track class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * @typedef TrackData
 * @type {Object}
 * @property {Point2D[]} active - Points currently in 'start' or 'move' phase.
 * @property {Point2D} centroid - centroid of currently active points.
 * @property {Number} centroid.x - x coordinate of centroid.
 * @property {Number} centroid.y - y coordinate of centroid.
 */

/**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 */
class Track extends Gesture {
  /**
   * Constructor for the Track class.
   *
   * @param {String[]} [phases] Phases to recognize. Entries can be any or all
   *    of 'start', 'move', and 'end'.
   */
  constructor(phases = []) {
    super('track');
    this.trackStart = phases.includes('start');
    this.trackMove  = phases.includes('move');
    this.trackEnd   = phases.includes('end');
  }

  /**
   * @private
   * @param {State} state - current input state.
   * @return {TrackData}
   */
  data({ activePoints, centroid }) {
    return { active: activePoints, centroid }; 
  }

  /**
   * Event hook for the start of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  start(state) {
    if (this.trackStart) return this.data(state);
  }

  /**
   * Event hook for the move of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  move(state) {
    if (this.trackMove) return this.data(state);
  }

  /**
   * Event hook for the end of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  end(state) {
    if (this.trackEnd) return this.data(state);
  }
}

module.exports = Track;

