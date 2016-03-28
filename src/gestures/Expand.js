/**
 * @file Expand.js
 * Contains the Expand class
 */

import Distance from './Distance.js';
import util from './../core/util.js';

/**
 * An Expand is defined as two inputs moving farther away from each other. This gesture does
 * not account for any start/end events to allow for the event to interact with the Pan and Pinch
 * events.
 * @class Expand
 */
class Expand extends Distance {
  /**
   * Constructor function for the Expand class.
   */
  constructor(options) {
    super(options);

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'expand';

    /**
     * The expected direction of the two points.
     * @type {String}
     */
    this.direction =  'apart';
  }

}

export default Expand;
