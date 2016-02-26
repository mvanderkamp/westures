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
  constructor(element, gesture, handler, capture) {
    this.element = element;
    this.gesture = gesture;
    this.handler = handler;

    //noinspection JSUnusedGlobalSymbols
    this.capture = capture;
  }
}

export default Binding;
