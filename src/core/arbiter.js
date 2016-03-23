/**
 * @file arbiter.js
 * Contains logic for the dispatcher
 */

import dispatcher from './dispatcher.js';
import Input from './classes/Input.js';
import interpreter from './interpreter.js';
import util from './util.js';

/**
 * Function that handles event flow, negotiating with the interpreter, and dispatcher.
 * 1. Receiving all touch events in the window.
 * 2. Determining which gestures are linked to the target element.
 * 3. Negotiating with the Interpreter what event should occur.
 * 4. Sending events to the dispatcher to emit events to the target.
 * @param {Event} event - The event emitted from the window object.
 * @param {Object} state - The state object of the current listener.
 */
function arbiter(event, state) {
  /*
   Return if a gesture is not in progress and won't be. Also catches the case where a previous
   event is in a partial state (2 finger pan, waits for both inputs to reach touchend)
   */
  if (state.inputs.length === 0 && util.normalizeEvent(event.type) !== 'start') {
    return;
  }

  //Update the state with the new events. If the event is stopped, return;
  if (!state.updateInputs(event)) {
    return;
  }

  //Retrieve the initial target from any one of the inputs
  var bindings = state.retrieveBindings(event.currentTarget);
  if (bindings.length > 0) {
    event.preventDefault();
    var gestures = interpreter(bindings, event, state);
    var fired = [];
    for (var i = 0; i < gestures.length; i++) {

      //Check if the type gesture signature has yet to be fired.
      var hasNotFired = true;
      for (var k = 0; k < fired.length; k++) {
        if (fired[k].id === gestures[i].binding.gesture.id &&
          fired[k].type === gestures[i].binding.gesture.type
        ) {
          hasNotFired = false;
          break;
        }
      }

      if (hasNotFired) {
        dispatcher(gestures[i].binding, gestures[i].data, gestures[i].events);
        fired.push(gestures[i].binding.gesture);
      }
    }
  }

  //TODO : Need to catch the document.addEventListener case and to iterate
  // through all the registered gestures.

  var endCount = 0;
  for (var i = 0; i < state.inputs.length; i++) {
    if (state.inputs[i].getCurrentEventType() === 'end') {
      endCount++;
    }
  }

  if (endCount === state.inputs.length) {
    state.resetInputs();
  }

}
/*arbiter*/

export default arbiter;
