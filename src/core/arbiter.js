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
 * @param {Object} region - The region object of the current listener.
 */
function arbiter(event, region) {
  var state = region.state;

  /*
   Return if a gesture is not in progress and won't be. Also catches the case where a previous
   event is in a partial state (2 finger pan, waits for both inputs to reach touchend)
   */
  if (state.inputs.length === 0 && util.normalizeEvent(event.type) !== 'start') {
    return;
  }

  /*
   Check for 'stale' or events that lost focus (e.g. a pan goes off screen/off region.
   Does not affect mobile devices.
   */
  if (typeof event.buttons !== 'undefined' && util.normalizeEvent(event.type) !== 'end' && event.buttons === 0) {
    state.resetInputs();
    return;
  }

  //Update the state with the new events. If the event is stopped, return;
  if (!state.updateInputs(event, region.element)) {
    return;
  }

  //Retrieve the initial target from any one of the inputs
  var bindings = state.retrieveBindingsByCoord();
  if (bindings.length > 0) {
    if (region.preventDefault) {
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }

    var toBeDispatched = {};
    var gestures = interpreter(bindings, event, state);

    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < gestures.length; i++) {
      var id = (gestures[i].binding.gesture.id) ? gestures[i].binding.gesture.id : gestures[i].binding.gesture.type;
      if (toBeDispatched[id]) {
        var path = util.getPropagationPath(event);
        if (util.getPathIndex(path, gestures[i].binding.element) < util.getPathIndex(path, toBeDispatched[id].binding.element)) {
          toBeDispatched[id] = gestures[i];
        }
      } else {
        toBeDispatched[id] = gestures[i];
      }
    }

    for (var index in toBeDispatched) {
      var gesture = toBeDispatched[index];
      dispatcher(gesture.binding, gesture.data, gesture.events);

    }
  }

  var endCount = 0;

  //noinspection JSDuplicatedDeclaration
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
