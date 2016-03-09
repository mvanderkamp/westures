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
const MAX_PROGRESS_STACK = 10;

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively increasing velocity and leaving the screen
 * at some point before it drops below it's escape velocity.
 * @class Swipe
 * @extends Gesture
 */
class Swipe extends Gesture {

  /**
   * Constructor function for the Swipe class.
   */
  constructor(numInputs) {
    super();
    /**
     * The type of the Gesture
     * @type {String}
     */
    this.type = 'swipe';

    /**
     * The number of inputs to trigger a Swipe can be variable, and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = (numInputs) ? numInputs : DEFAULT_INPUTS;

    //TODO: Allow maxRestTime, escapeVelocity, and timeDistortion to be modifiable.
  }

  /**
   * Event hook for the move of a gesture. Captures an input's x/y coordinates and the time of it's event on
   * a stack.
   * @param inputs
   * @returns {null}
   */
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

      if (progress.length > MAX_PROGRESS_STACK) {
        progress.moves.shift();
      }
    }

    return null;
  }
  /*move*/

  /**
   * Determines if the input's history validates a swipe motion. Determines if it did not come to a complete stop (MAX_REST_TIME),
   * and if it had enough of a velocity to be considered (ESCAPE_VELOCITY).
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
