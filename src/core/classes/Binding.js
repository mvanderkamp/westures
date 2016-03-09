/**
 * @file Binding.js
 * Contains logic for the class Input
 */

import state from './../state.js';

/**
 * Responsible for keeping track of a binding for a particular element to a gesture
 * @class Binding
 */
class Binding {
  /**
   * Constructor function for Binding
   * @param {Element} element - The element to associate the gesture to.
   * @param {Gesture} gesture - The object of type Gesture that handles gesture logic
   * @param {Function} handler - The function handler to execute when a gesture is recognized on the associated element
   * @param {Boolean} [capture=false] - A boolean signifying if the event is to be emitted during the capture or bubble phase.
   */
  constructor(element, gesture, handler, capture) {
    /**
     * The element to associate the gesture to.
     * @type {Element}
     */
    this.element = element;
    /**
     * The object of type Gesture that handles gesture logic
     * @type {Gesture}
     */
    this.gesture = gesture;
    /**
     *  The function handler to execute when a gesture is recognized on the associated element
     * @type {Function}
     */
    this.handler = handler;

    //noinspection JSUnusedGlobalSymbols
    /**
     *  A boolean signifying if the event is to be emitted during the capture or bubble phase.
     * @type {Boolean}
     */
    this.capture = (capture) ? capture : false;
  }
}

export default Binding;
