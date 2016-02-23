import state from './state.js';
import ZingTouch from './../ZingTouch.js';
import Input from './classes/Input.js';
import interpreter from './interpreter.js';
import dispatcher from './dispatcher.js';
import util from './util.js';

/**
 * Responsible for :
 * 1. Receiving all touch events in the window
 * 2. Determining which gestures are linked to the target element
 * 3. Negotiating with the Interpreter what event should occur
 * @param ev - The event emitted from the window object.
 */
function arbiter(ev) {

  //Retrieve current inputs and update them;  else, create new ones.
  var activeInputs = [];
  if (state.inputs.length === 0) {

    var inputs = (ev.touches) ? ev.touches : ({ 0: ev });
    for (let idx in inputs) {
      console.log(ev.type);
      if (util.normalizeEvent(ev.type) === 'start') {

        state.inputs.push(new Input(inputs[idx]));
      }
    }

    activeInputs = state.inputs;
  } else {
    //Retrieve the inputs array from the state, update them, and determine new actions to be taken.
    activeInputs = state.updateInputs(ev);
  }

  if (activeInputs && activeInputs.length > 0) {
    var bindings = [];
    activeInputs.forEach((input, idx, arr) => {

      //Dispatch Event
      var binding = state.retrieveBinding(ev.target);
      if (binding) {
        bindings.push(binding);
      }

      //Cleanup
      if (input.current.type === 'end') {
        state.removeInput(input.id);
      }
    });

    if (bindings.length > 0) {
      var action = interpreter(bindings, event);
      if (action) {
        dispatcher(action.type, action.target, action.data);
      }

    }
  }

  //TODO : Obtain the appropriate element->gesture relations

}

export default arbiter;
