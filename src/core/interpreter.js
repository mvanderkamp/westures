/**
 * @file interpreter.js
 * Contains logic for the interpreter
 */

import state from './state.js';
import util from './util.js';

/**
 * Receives an event and an array of Bindings (element -> gesture handler) to determine
 * what event will be emitted. Called from the arbiter.
 * @param {Array} bindings - An array containing Binding objects that associate the element to an event handler.
 * @param {Object} event - The event emitted from the window.
 * @returns {null|Object} - null if a gesture will not be emitted, otherwise an Object with information
 * for the dispatcher.
 */
function interpreter(bindings, event) {
  var evType = util.normalizeEvent(event.type);
  var target = bindings[0].element;
  var metaData = {};

  bindings.forEach(function (binding, index, arr) {
    let result = binding.gesture[evType](state.inputs);
    if (result) {
      metaData[binding.gesture.getType()] = result;
    }
  });

  //TODO: Determine which event will be emitted (only 1!)
  if (metaData.tap) {
    return {
      type: 'tap',
      target: target,
      data: metaData.tap
    };

  } else {
    return null;
  }

}

export default interpreter;
