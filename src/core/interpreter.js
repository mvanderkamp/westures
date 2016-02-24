import state from './state.js';
import util from './util.js';

function interpreter(bindings, event) {
  var evType = util.normalizeEvent(event.type);
  var target = bindings[0].element;

  var metaData = {};

  //Iterate through each
  for (var name in state.registeredGestures) {
    let gesture = state.registeredGestures[name];
    let result = gesture[evType](state.inputs);
    if (result) {
      metaData[name] = result;
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
