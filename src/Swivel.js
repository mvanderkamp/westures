/**
 * @file Rotate.js
 * Contains the Rotate class
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 */
class Swivel extends Gesture {
  constructor(deadzoneRadius = 10) {
    super('swivel');
    this.deadzoneRadius = deadzoneRadius;
  }

  start(state) {
    const started = state.getInputsInPhase('start')[0];
    const progress = started.getProgressOfGesture(this.id);
    const current = started.current;
    const point = current.point;
    const event = current.originalEvent;
    if (event.ctrlKey) {
      progress.pivot = point;
    }
  }

  move(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length === 1) {
      const input = active[0];

      if (input.totalDistanceIsWithin(this.deadzoneRadius)) {
        return null;
      }

      const event = input.current.originalEvent;
      const progress = input.getProgressOfGesture(this.id);
      if (event.ctrlKey && progress.pivot) {
        const point = input.current.point;
        const pivot = progress.pivot;
        const angle = pivot.angleTo(point);
        let delta = 0;
        if (progress.hasOwnProperty('previousAngle')) {
          delta = angle - progress.previousAngle;
        }
        progress.previousAngle = angle;
        return { delta, pivot, point };
      } else {
        // CTRL key was released, therefore pivot point is now invalid.
        delete progress.pivot;
      }
    }
  }
}

module.exports = Swivel;

