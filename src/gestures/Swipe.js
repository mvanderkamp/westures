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

  move(inputs) {
    if (this.numInputs === inputs.length) {
      var input = util.getRightMostInput(inputs);
      var progress = input.getGestureProgress(this.getId());

      if (!progress.moves) {
        progress.moves = [];
      }

      progress.moves.push({
        time: new Date().getTime(),
        x: input.current.x,
        y: input.current.y
      });

      if (progress.length > 10) {
        progress.moves.shift();
      }
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

    if (progress.moves.length > 2) {

      //Return if the input has not moved in MAX_REST_TIME ms.
      var currentMove = progress.moves.pop();

      if ((new Date().getTime()) - currentMove.time > MAX_REST_TIME) {
        return null;
      }
 
      var lastMove;
      var index = progress.moves.length - 1;

      //Date is unreliable, so we retrieve the last move event where the time is not the same. .
      while (index !== -1) {
        if (progress.moves[index].time !== currentMove.time) {
          lastMove = progress.moves[index];
          break;
        }

        index--;
      }

      //If the date is REALLY unreliable, we apply a time distortion to the last event.
      if (!lastMove) {
        lastMove = progress.moves.pop();
        lastMove.time += TIME_DISTORTION;
      }

      var velocity = util.getVelocity(lastMove.x, lastMove.y, lastMove.time,
        currentMove.x, currentMove.y, currentMove.time);

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
