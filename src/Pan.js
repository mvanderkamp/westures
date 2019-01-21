/**
 * @file Pan.js
 * Contains the Pan class
 */

const { Gesture, Point2D } = require('westures-core');

const REQUIRED_INPUTS = 1;
const DEFAULT_MIN_THRESHOLD = 1;

const CANCELED = Object.freeze({ 
  change: new Point2D(0,0),
  point: new Point2D(0,0),
  phase: 'cancel' 
});

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

    /**
     * Don't emit any data if this key is pressed.
     *
     * @type {String}
     */
    this.muteKey = options.muteKey;
  }

  initialize(state) {
    const active = state.getInputsNotInPhase('end');
    if (active.length > 0) {
      const point = Point2D.midpoint(active.map( i => i.current.point));
      const progress = active[0].getProgressOfGesture(this.id);
      progress.lastEmitted = point;
    }
  }

  /**
   * Event hook for the start of a gesture. Marks each input as active, so it
   * can invalidate any end events.
   *
   * @param {State} input status object
   */
  start(state) {
    this.initialize(state);
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

    const progress = active[0].getProgressOfGesture(this.id);
    const point = Point2D.midpoint(active.map( i => i.current.point));
    const diff = point.distanceTo(progress.lastEmitted);

    const change = point.minus(progress.lastEmitted);
    progress.lastEmitted = point;

    // Mute if the MUTEKEY was pressed.
    const event = active[0].current.originalEvent;
    const muted = this.muteKey && event[this.muteKey];

    if (!muted) {
      return { change, point, phase: 'move' };
    } else {
      return null;
    }
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
    this.initialize(state);
  }
  /* end*/
}

module.exports = Pan;

