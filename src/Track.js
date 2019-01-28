/**
 * @file Track.js
 * Contains the Track class
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

/**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 *
 * @class Track
 */
class Track extends Gesture {
  constructor(phases = []) {
    super('track');
    this.trackStart = phases.includes('start');
    this.trackMove  = phases.includes('move');
    this.trackEnd   = phases.includes('end');
  }

  data({ activePoints, centroid }) {
    return { active: activePoints, centroid }; 
  }

  start(state) {
    if (this.trackStart) return this.data(state);
  }

  move(state) {
    if (this.trackMove) return this.data(state);
  }

  end(state) {
    if (this.trackEnd) return this.data(state);
  }
}

module.exports = Track;

