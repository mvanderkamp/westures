/**
 * @file dispatcher.js
 * Contains logic for the dispatcher
 */

/**
 * Emits data at the target element if available, and bubbles up from the target to the parent
 * until the document has been reached. Called from the arbiter.
 * @param {Binding} binding - An object of type Binding
 * @param {Object|null} data - The metadata computed by the gesture being emitted.
 * @param {Array} events - An array of ZingEvents, corresponding to the inputs on the screen.
 */
function dispatcher(binding, data, events) {
  data.events = events;

  //noinspection JSCheckFunctionSignatures
  var newEvent = new CustomEvent(binding.gesture.getId(), {
    detail: data
  });
  emitEvent(binding.element, newEvent, binding);
}
/*dispatcher*/

/**
 * Emits the new event recursively until the document is reached.
 * @param {Element} target - Element object to emit the event to.
 * @param {Event} event - The CustomEvent to emit.
 */
function emitEvent(target, event, binding) {
  target.dispatchEvent(event);
  if (target.parentNode && target.parentNode !== document) {
    emitEvent(target.parentNode, event, binding);
  } else {
    if (binding.bindOnce) {
      ZingTouch.unbind(binding.element, binding.gesture.getType());
    }

  }
}
/*emitEvent*/

export default dispatcher;
