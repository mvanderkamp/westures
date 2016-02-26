/**
 * @file dispatcher.js
 * Contains logic for the dispatcher
 */

import state from './state.js';

/**
 * Emits data at the target element if available, and bubbles up from the target. Called from the arbiter.
 * @param {String} type - The type of event to emit
 * @param {Object} data -Metadata about the event being emitted
 * @param {Element} target - Element object to emit the event to.
 */
function dispatcher(type, target, data) {
  var newEvent = new CustomEvent(type, {
    detail: data
  });
  emitEvent(target, newEvent);
}/*dispatcher*/

/**
 * Emits the new event recursively until the document is reached.
 * @param {Element} target - Element object to emit the event to.
 * @param {Object} event - The CustomEvent to emit.
 */
function emitEvent(target, event) {
  target.dispatchEvent(event);
  if (target.parentNode && target.parentNode !== document) {
    emitEvent(target.parentNode, event);
  }
}/*emitEvent*/

export default dispatcher;
