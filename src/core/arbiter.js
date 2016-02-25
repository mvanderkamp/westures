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
 * @param ev - The event emitted from the window object.
 */
function arbiter(ev) {
  //Return if a gesture is not in progress and won't be.
  if (state.inputs.length === 0 && util.normalizeEvent(ev.type) !== 'start') {
    return;
  }

  //Return if all gestures did not originate from the same target.
  if (ev.touches && ev.touches.length !== ev.targetTouches.length) {
    state.inputs = [];
    return;
  }

  //Update the state with the new events
  state.updateInputs(ev);

  //Retrieve the initial target from any one of the inputs
  var bindings = state.retrieveBindings(ev.target);
  if (bindings.length > 0) {
    var action = interpreter(bindings, event);
    if (action) {
      dispatcher(action.type, action.target, action.data);
    }
  }

  //If gesture has finished, reset state.
  if (util.normalizeEvent(ev.type) === 'end') {
    state.inputs = [];
  }

}

export default arbiter;
