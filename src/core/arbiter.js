/**
 * @file arbiter.js
 * Contains logic for the dispatcher
 */

const interpreter = require('./interpreter.js');
const util        = require('./util.js');

/**
 * Function that handles event flow, negotiating with the interpreter,
 * and dispatcher.
 * 1. Receiving all touch events in the window.
 * 2. Determining which gestures are linked to the target element.
 * 3. Negotiating with the Interpreter what event should occur.
 * 4. Sending events to the dispatcher to emit events to the target.
 * @param {Event} event - The event emitted from the window object.
 * @param {Object} region - The region object of the current listener.
 */
function arbiter(event, region) {
  const state = region.state;
  const eventType = util.normalizeEvent[ event.type ];

   /*
    * Return if a gesture is not in progress and won't be. Also catches the case
    * where a previous event is in a partial state (2 finger pan, waits for both
    * inputs to reach touchend)
    */
  if (state.inputs.length === 0 && eventType !== 'start') {
    return;
  }

  state.updateAllInputs(event, region.element);

  // Retrieve the initial target from any one of the inputs
  const bindings = state.retrieveBindingsByInitialPos();
  if (bindings.length > 0) {
    if (region.preventDefault) {
      event.preventDefault();
    }

    const candidates = interpreter(bindings, event, state);

    // Determine the deepest path index to emit the event from, to avoid
    // duplicate events being fired.
    const toBeDispatched = getDeepestDispatches(event, candidates);

    Object.values(toBeDispatched).forEach( ({ binding, data }) => {
      binding.dispatch(data);
    });
  }

  if (state.getInputsInPhase('end').length === state.inputs.length) {
    state.resetInputs();
  }
}

function getDeepestDispatches(event, candidates) {
  const toBeDispatched = {};
  const path = util.getPropagationPath(event);

  candidates.forEach( candidate => {
    const id = candidate.binding.gesture.id;
    if (toBeDispatched[id]) {
      const curr = util.getPathIndex(path, candidate.binding.element);
      const prev = util.getPathIndex(path, toBeDispatched[id].binding.element);
      if (curr < prev) {
        toBeDispatched[id] = candidate;
      }
    } else {
      toBeDispatched[id] = candidate;
    }
  });

  return toBeDispatched;
}

module.exports = arbiter;
