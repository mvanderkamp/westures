import {state} from '../core/state.js';

/**
 * Object that contains a map of binding. Created from the ZingTouch.bind() event.
 * @type {{tap: Bindings.tap}}
 */
class Binding {
  constructor(element) {
    this.element = element;
    for (var key in state.bindings) {
      this[key] = state.bindings;
    }
  }
};

export {Binding};
