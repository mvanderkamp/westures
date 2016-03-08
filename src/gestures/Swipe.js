/**
 * @file Swipe.js
 * Contains the Swipe class
 */

import Gesture from './Gesture.js';
import state from './../core/state.js';
import util from './../core/util.js';

const DEFAULT_INPUTS = 1;
const MAX_REST_TIME = 100;
const ESCAPE_VELOCITY = 0.2;
const TIME_DISTORTION = 100;

/**
 * Gesture object detailing Swipe functionality.
 * @class Swipe
 * @extends Gesture
 */
class Swipe extends Gesture {
  constructor(numInputs) {
    super();
    this.type = 'swipe';
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;
  }

  start(inputs) {

    return null;
  }

  //Store the last 10 events to get a good resolution of
  move(inputs) {
    if (this.numInputs === inputs.length) {
      var input = util.getRightMostInput(inputs);
      var progress = input.getGestureProgress(this.getId());

      if (progress.currentMove) {
        progress.lastMove = progress.currentMove;
      }

      progress.currentMove = {
        time: new Date().getTime(),
        x: input.current.x,
        y: input.current.y
      };
    }

    return null;
  }

  /*move*/

  /**
   * end() - Event hook for the end of a gesture. This assumes that no other event can be started until all inputs are off of the screen.
   * @param {Array} inputs - The array of Inputs on the screen
   * @returns {null} - null if the gesture is not to be emitted, Object with information otherwise.
   */
  end(inputs) {

    var input = util.getRightMostInput(inputs);
    var progress = input.getGestureProgress(this.getId());

    if (progress.currentMove && progress.lastMove) {

      //Return if the input has not moved in MAX_REST_TIME ms.
      if ((new Date().getTime()) - progress.currentMove.time > MAX_REST_TIME) {
        return null;
      }

      //Date is unreliable, so we distort the cases where the time is the same.
      if (progress.lastMove.time === progress.currentMove.time) {
        progress.currentMove.time += TIME_DISTORTION;
      }

      var velocity = util.getVelocity(progress.lastMove.x, progress.lastMove.y, progress.lastMove.time,
        progress.currentMove.x, progress.currentMove.y, progress.currentMove.time);

      console.log(velocity);
      if (velocity > ESCAPE_VELOCITY) {
        return {
          velocity: velocity
        };
      }
    }

    return null;

  }

  /*end*/
}

export default Swipe;
