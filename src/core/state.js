import Binding from './classes/Binding.js';
import Input from './classes/Input.js';
import Tap from './../gestures/Tap.js';
import Gesture from './../gestures/Gesture.js';
import util from './util.js';

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
   * @param handler
   * @param capture
   */
  addBinding: function (element, gesture, handler, capture) {
    if (typeof gesture === 'string') {
      gesture = this.registeredGestures[gesture];
      if (typeof gesture === 'undefined') {
        return null;
      }
    } else if (!(gesture instanceof Gesture)) {
      return null;
    }

    this.bindings.push(new Binding(element, gesture, handler, capture));
    return this.bindings[this.bindings.length - 1];
  },

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param element
   */
  retrieveBindings: function (element) {
    var matches = [];
    for (var i = 0; i < this.bindings.length; i++) {
      if (this.bindings[i].element === element) {
        matches.push(this.bindings[i]);
      }
    }

    return matches;
  },

  /**
   * Updates the inputs based on the current event.
   * Creates new Inputs if none exist, or more inputs were received.
   * @returns all updated inputs.
   */
  updateInputs: function (ev) {

    if (ev.touches) {
      for (var index in ev.touches) {
        if (ev.touches.hasOwnProperty(index)) {
          if (util.normalizeEvent(ev.type) === 'start') {
            this.inputs.push(new Input(ev, index));
          } else {
            this.inputs[index].update(ev, index);
          }
        }
      }
    } else {
      if (util.normalizeEvent(ev.type) === 'start') {
        this.inputs.push(new Input(ev));
      } else {
        this.inputs[0].update(ev);
      }
    }

    return this.inputs;
  }

};

export default state;

