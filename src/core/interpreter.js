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

  for (var name in state.registeredGestures) {
    if (state.registeredGestures.hasOwnProperty(name)) {
      let gesture = state.registeredGestures[name];
      let result = gesture[evType](state.inputs);
      if (result) {
        metaData[name] = result;
      }
    }
  }

  //TODO: Determine which event will be emitted (only 1!)
  var key = 'tap';

  if (metaData[key]) {
    return {
      type: key,
      target: target,
      data: metaData[key]
    };

  } else {
    return null;
  }

}

export default interpreter;
