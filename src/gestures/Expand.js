/**
 * @file Expand.js
 * Contains the Expand class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;

class Expand extends Gesture {
  constructor() {
    super();
    this.type = 'expand';
  }

  move(inputs) {
    if (inputs.length === DEFAULT_INPUTS) {
      var currentDistance = util.distanceBetweenTwoPoints(inputs[0].current.x, inputs[1].current.x, inputs[0].current.y, inputs[1].current.y);
      var lastDistance = util.distanceBetweenTwoPoints(inputs[0].last.x, inputs[1].last.x, inputs[0].last.y, inputs[1].last.y);
      if (currentDistance > lastDistance) {
        return {
          distance: currentDistance
        };

      } else {
        return null;
      }
    }
  }
}

export default Expand;
