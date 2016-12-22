/**
 * @file Pinch.js
 * Contains the Pinch class
 */

import Distance from './Distance.js';
import util from './../core/util.js';

/**
 * An Pinch is defined as two inputs moving closer to each other.
 * This gesture does not account for any start/end events to allow for the event
 * to interact with the Pan and Pinch events.
 * @class Pinch
 */
class Pinch extends Distance {
  /**
   * Constructor function for the Pinch class.
   * @param {Object} options
   */
  constructor(options) {
    super(options);

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pinch';
  }

}

export default Pinch;
