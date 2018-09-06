/**
 * @file State.js
 */

const Gesture = require('./Gesture.js');
const Binding = require('./Binding.js');
const Input   = require('./Input.js');
const util    = require('./../util.js');

const DEFAULT_MOUSE_ID = 0;

/**
 * Creates an object related to a Region's state, and contains helper methods to
 * update and clean up different states.
 */
class State {
  /**
   * Constructor for the State class.
   * @param {String} regionId - The id the region this state is bound to.
   */
  constructor() {
    /**
     * An array of current and recently inactive
     *  Input objects related to a gesture.
     * @type {Input}
     */
    this.inputs = [];

    /**
     * The list of relations between elements, their gestures, and the handlers.
     * @type {Binding}
     */
    this.bindings = [];
  }

  /**
   * Creates a new binding with the given element and gesture object. 
   *
   * @param {Element} element - The element the gesture is bound to.
   * @param {Gesture} gesture - The Gesture to bind. 
   * @param {Function} handler - The function handler to be called when the
   * event is emitted. Used to bind/unbind.
   * @param {Boolean} capture - Whether the gesture is to be detected in the
   * capture of bubble phase. Used to bind/unbind.
   * @param {Boolean} bindOnce - Option to bind once and only emit the event
   * once.
   */
  addBinding(element, gesture, handler, capture, bindOnce) {
    if (!(gesture instanceof Gesture)) {
      throw new Error('Parameter for the gesture is not of a Gesture type');
    }

    this.bindings.push(new Binding(
      element, 
      gesture,
      handler, 
      capture, 
      bindOnce
    ));

    element.addEventListener(gesture.id, handler, capture);
  }

  /**
   * @return {Array} Inputs in the given phase.
   */
  getInputsInPhase(phase) {
    return this.inputs.filter( i => i && i.phase === phase );
  }

  /**
   * @return {Array} Inputs _not_ in the given phase.
   */
  getInputsNotInPhase(phase) {
    return this.inputs.filter( i => i && i.phase !== phase );
  }

  /**
   * Removes all inputs from the state, allowing for a new gesture.
   */
  resetInputs() {
    this.inputs = [];
  }

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param {Element} element - The element to find bindings to.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByElement(element) {
    return this.bindings.filter( b => b.element === element );
  }

  /**
   * Retrieves all bindings based upon the initial X/Y position of the inputs.
   * e.g. if gesture started on the correct target element,
   *  but diverted away into the correct region, this would still be valid.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByInitialPos() {
    return this.bindings.filter( 
      b => this.inputs.some( i => i && i.wasInitiallyInside(b.element) )
    );
  }

  /**
   * Update the input with the given identifier using the given event.
   *
   * @param {Event} event - The event being captured.
   * @param {Number} identifier - The identifier of the input to update.
   */
  updateInput(event, identifier) {
    if (util.normalizeEvent[ event.type ] === 'start') {
      this.inputs[identifier] = new Input(event, identifier);
    } else {
      this.inputs[identifier].update(event, identifier);
    }
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   * @param {Event} event - The event being captured.
   *  this current Region is bound to.
   * @return {boolean} - returns true for a successful update,
   *  false if the event is invalid.
   */
  updateAllInputs(event) {
    const update_fns = {
      TouchEvent: (event) => {
        Array.from(event.changedTouches).forEach( touch => {
          this.updateInput(event, touch.identifier);
        });
      },

      PointerEvent: (event) => {
        this.updateInput(event, event.pointerId);
      },

      MouseEvent: (event) => {
        this.updateInput(event, DEFAULT_MOUSE_ID);
      },
    };

    update_fns[event.constructor.name].call(this, event);
  }
}

module.exports = State;

