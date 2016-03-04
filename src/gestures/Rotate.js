/**
 * @file Rotate.js
 * Contains the Rotate class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 2;

class Rotate extends Gesture {
  constructor() {
    super();
    this.type = 'rotate';
  }

  start(inputs) {
    //Track reference points and angle.
  }

  move(inputs) {
    if (state.numActiveInputs() === DEFAULT_INPUTS) {

      var referencePivot = util.getMidpoint(inputs[0].initial.x, inputs[1].initial.x, inputs[0].initial.y, inputs[1].initial.y);
      var currentPivot = util.getMidpoint(inputs[0].current.x, inputs[1].current.x, inputs[0].current.y, inputs[1].current.y);
      var diffX = referencePivot.x - currentPivot.x;
      var diffY = referencePivot.y - currentPivot.y;
      var input = getRightMostEvent(inputs[0], inputs[1]);

      //Translate the current pivot point.
      var angle = getAngle(referencePivot.x, referencePivot.y, input.current.x + diffX, input.current.y + diffY);
      return {
        detail: angle
      };
    }

    return null;
  }

}

function getAngle(pivotX, pivotY, x, y) {
  var angle = Math.atan2(y - pivotY, x - pivotX) * (180 / Math.PI);
  if (angle === 0) {
    console.log('err');
  }

  if (angle < 0) {
    return 360 + angle;
  } else {
    return angle;
  }
}

function getRightMostEvent(input0, input1) {
  if (input0.initial.x < input1.initial.x) {
    return input1;
  } else {
    return input0;
  }
}

export default Rotate;
