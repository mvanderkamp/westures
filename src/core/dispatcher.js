import state from './state.js';

/**
 * Emits data at the target element and bubbles up from
 * @param type - The type of event to emit
 * @param data
 */
function dispatcher(type, target, data) {
  var newEvent = new CustomEvent(type, {
    detail: data
  });
  emitEvent(target, newEvent);
}

/**
 * Emits the new event recurrsively until the document is reached.
 * @param target
 * @param event
 */
function emitEvent(target, event) {
  target.dispatchEvent(event);
  if (target.parentNode && target.parentNode !== document) {
    emitEvent(target.parentNode, event);
  }
}

export default dispatcher;
