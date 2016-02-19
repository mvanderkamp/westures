import {state} from './state.js'
import {ZingTouch} from './../ZingTouch.js';
import {Input} from './../classes/Input.js';
import {interpreter} from './interpreter.js';
import {dispatcher} from './dispatcher.js';

/**
 * Responsible for :
 * 1. Receiving all touch events in the window
 * 2. Determining which gestures are linked to the target element
 * 3. Negotiating with the Interpreter what event should occur
 * @param event - The event emitted from the window object.
 */
function arbiter(event) {

  //Convert event information to Input for normalization.
  state.inputs = [];
  if (event.touches) {
    event.touches.forEach((val, idx, arr) => {
      state.inputs.push(new Input(val));
    });
  } else {
    state.inputs.push(new Input(event));
  }

  //If the initial state, store the inputs and target.
  if (!state.currentTarget) {
    state.currentTarget = event.target;
    state.inputs.forEach((val, idx, arr)=> {
      state.initialState.push(val);
    });
  }

  //TODO : Obtain the appropriate element->gesture relations
  var oHandler = {};
  var oData = interpreter(oHandler);
  dispatcher(oData.type, oData.info);
  if (oData.terminated) {
    state.currentTarget = null;
  }
}

export {arbiter};
