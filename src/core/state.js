import Binding from './classes/Binding.js';
import Tap from './../gestures/Tap.js';
import Gesture from './../gestures/Gesture.js';

var state = {
  inputs: [], //Contains current inputs (touches) on the screen
  bindings: [], //Collection of element -> binding relations,
  registeredGestures: { //Functions with keys to be iterated and used in the interpreter.
    tap: new Tap()
  },
  /**
   * Creates a new binding with the given element and gesture object. If the gesture object provided is
   * unregistered, it's reference will be saved in as a binding.
   * @param element {object} - The element the gesture is bound to.
   * @param gesture {string/object} - Either a name of a registered gesture, or an unregistered Gesture object.
   */
  addBinding: function (element, gesture, handler) {
    if (typeof gesture === 'string') {
      gesture = this.registeredGestures[gesture];
      if (typeof gesture === 'undefined') {
        return null;
      }
    } else if (!(gesture instanceof Gesture)) {
      return null;
    }

    this.bindings.push(new Binding(element, gesture, handler));
    return this.bindings[this.bindings.length - 1];
  },
  /**
   * Updates the inputs based on the current event. If the input is still active but did not participate in this event,
   * it's currentState will be set to null.
   * Returns a subset of inputs that participated in this event.
   */
  updateInputs: function (ev) {
    var activeInputs = [];
    this.inputs.forEach((input, idx, arr)=> {
      if (input.update(ev)) {
        activeInputs.push(input);
      }

    });

    return activeInputs;
  },

  /**
   * Removes the input from the array based upon it's id.
   * @param id
   */
  removeInput: function (id) {
    this.inputs.forEach((input, idx, arr)=> {
      if (input.id === id) {
        this.inputs.splice(idx, 1);
      }
    });
  },

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param element
   */
  retrieveBinding: function (element) {
    for (var i = 0; i < this.bindings.length; i++) {
      if (this.bindings[i].element === element) {
        return this.bindings[i];
      }
    }

    return null;
  }

};

export default state;
