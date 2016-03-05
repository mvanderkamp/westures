/**
 * @file arbiter.js
 * Contains logic for the dispatcher
 */

import dispatcher from './dispatcher.js';
import Input from './classes/Input.js';
import interpreter from './interpreter.js';
import state from './state.js';
import util from './util.js';
import ZingTouch from './../ZingTouch.js';

/**
 * Responsible for :
 * 1. Receiving all touch events in the window
 * 2. Determining which gestures are linked to the target element
 * 3. Negotiating with the Interpreter what event should occur
 * 4. Sending events to the dispatcher to emit events to the target.
 * @param event - The event emitted from the window object.
 */
function arbiter(event) {

  /*
    Return if a gesture is not in progress and won't be.
    Also catches the case where a previous event is in a partial state (2 finger pan, waits for both inputs to reach touchend)
   */
  if (state.inputs.length === 0 && util.normalizeEvent(event.type) !== 'start') {
    return;
  }

  //Update the state with the new events. If the event is stopped, return;
  if (!state.updateInputs(event)) {
    return;
  }
  //Retrieve the initial target from any one of the inputs
  var bindings = state.retrieveBindings(event.target);
  if (bindings.length > 0) {
    event.preventDefault();
    var gesture = interpreter(bindings, event);
    if (gesture) {
      dispatcher(gesture.binding, gesture.data);
    }
  }

  //TODO : Need to catch the vanilla addEventListener case and to iterate through all the gestures.

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
