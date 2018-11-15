/**
 * @file Pan.js
 * Contains the Pan class
 */

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pan is defined as a normal movement in any direction on a screen.  Pan
 * gestures do not track start events and can interact with pinch and expand
 * gestures.
 *
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   *
   * @param {Object} [options] - The options object.
   * @param {Number} [options.threshold=1] - The minimum number of pixels the
   *    input has to move to trigger this gesture.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * The minimum amount in pixels the pan must move until it is fired.
     *
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  initialize(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length > 0) {
      const progress = active[0].getProgressOfGesture(this.id);
      progress.lastEmitted = active[0].cloneCurrentPoint();
      return { change: 0, point: progress.lastEmitted };
    }
    return null;
  }

  /**
   * Event hook for the start of a gesture. Marks each input as active, so it
   * can invalidate any end events.
   *
   * @param {State} input status object
   */
  start(state) {
    const data = this.initialize(state);
    if (data) data.phase = 'start';
    return data;
  }
  /* start */

  /**
   * move() - Event hook for the move of a gesture.  
   * @param {State} input status object
   *
   * @return {Object} The change in position and the current position.
   */
  move(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length !== REQUIRED_INPUTS) {
      return { change: 0, point: { x: 0, y: 0 }, phase: 'cancel' };
    }

    const progress = active[0].getProgressOfGesture(this.id);
    const point = active[0].current.point;
    const diff = point.distanceTo(progress.lastEmitted);

    if (diff >= this.threshold) {
      const change = point.subtract(progress.lastEmitted);
      progress.lastEmitted = point;
      return { change, point, phase: 'move' };
    } 

    return null;
  }
  /* move*/

  /**
   * end() - Event hook for the end of a gesture. 
   *
   * @param {State} input status object
   *
   * @return {null} 
   */
  end(state) {
    let data = null;
    const ended = state.getInputsInPhase('end');
    const active = state.getInputsNotInPhase('end');

    // If the ended input was part of a valid pan, need to emit an event
    // notifying that the pan has ended. Have to make sure that only inputs
    // which were involved in a valid pan pass through this block. Checking for
    // a 'lastEmitted' entity will do the trick, as it will only exist on the
    // first active input, which is the only one that can currently be part of a
    // valid pan.
    if (ended.length > 0) {
      const progress = ended[0].getProgressOfGesture(this.id);
      if (progress.lastEmitted) {
        const point = ended[0].current.point;
        const change = point.subtract(progress.lastEmitted);
        data = { change, point, phase: 'end' };
      }
    }

    this.initialize(state);
    return data;
  }
  /* end*/
}

module.exports = Pan;

