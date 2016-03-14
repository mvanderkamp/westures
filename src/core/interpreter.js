/**
 * @file interpreter.js
 * Contains logic for the interpreter
 */

import util from './util.js';

/**
 * Receives an event and an array of Bindings (element -> gesture handler) to determine
 * what event will be emitted. Called from the arbiter.
 * @param {Array} bindings - An array containing Binding objects that associate the
 * element to an event handler.
 * @param {Object} event - The event emitted from the window.
 * @param {Object} state - The state object of the current listener.
 * @returns {Object | null} - Returns an object containing a binding and metadata,
 * or null if a gesture will not be emitted.
 */
function interpreter(bindings, event, state) {
  var evType = util.normalizeEvent(event.type);
  var candidates = [];
  bindings.forEach(function (binding) {
    let result = binding.gesture[evType](state.inputs, state);
    if (result) {
      candidates.push({
        binding: binding,
        data: result
      });
    }
  });

  //TODO : Determine which gesture to emit, or all. For now, we return the bindings
  // in order which they were bound.
  //if (candidates.length > 0) {
  //  return candidates[0];
  //} else {
  //  return null;
  //}
  return candidates;

}

export default interpreter;
