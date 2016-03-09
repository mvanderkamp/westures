/**
 * @file dispatcher.js
 * Contains logic for the dispatcher
 */

import state from './state.js';

/**
 * Emits data at the target element if available, and bubbles up from the target. Called from the arbiter.
 * @param {Object} binding - An object of type Binding
 * @param {Object} data - The metadata to emit
 */
function dispatcher(binding, data) {

  //noinspection JSCheckFunctionSignatures
  var newEvent = new CustomEvent(binding.gesture.getId(), {
    detail: data
  });
  emitEvent(binding.element, newEvent);
}
/*dispatcher*/

/**
 * Emits the new event recursively until the document is reached.
 * @param {Node} target - Element object to emit the event to.
 * @param {Event} event - The CustomEvent to emit.
 */
function emitEvent(target, event) {
  target.dispatchEvent(event);
  if (target.parentNode && target.parentNode !== document) {
    emitEvent(target.parentNode, event);
  }
}
/*emitEvent*/

export default dispatcher;
