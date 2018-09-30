/**
 * @file Binding.js
 */

/**
 * Responsible for creating a binding between an element and a gesture.
 *
 * @class Binding
 */
class Binding {
  /**
   * Constructor function for the Binding class.
   *
   * @param {Element} element - The element to associate the gesture to.
   * @param {Gesture} gesture - A instance of the Gesture type.
   * @param {Function} handler - The function handler to execute when a gesture
   *    is recognized on the associated element.
   */
  constructor(element, gesture, handler) {
    /**
     * The element to associate the gesture to.
     *
     * @type {Element}
     */
    this.element = element;

    /**
     * A instance of the Gesture type.
     *
     * @type {Gesture}
     */
    this.gesture = gesture;

    /**
     * The function handler to execute when a gesture is recognized on the
     * associated element.
     *
     * @type {Function}
     */
    this.handler = handler;

    // Start listening immediately.
    this.listen();
  }

  /**
   * Dispatches a custom event on the bound element, sending the provided data.
   * The event's name will be the id of the bound gesture.
   *
   * @param {Object} data - The data to send with the event.
   */
  dispatch(data) {
    this.element.dispatchEvent(new CustomEvent(
      this.gesture.id, {
        detail: data,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  /**
   * Evalutes the given gesture hook, and dispatches any data that is produced.
   */
  evaluateHook(hook, state, events) {
    const data = this.gesture[hook](state);
    if (data) {
      data.events = events;
      this.dispatch(data);
    }
  }

  /**
   * Sets the bound element to begin listening to events of the same name as the
   * bound gesture's id.
   */
  listen() {
    this.element.addEventListener(
      this.gesture.id,
      this.handler,
    );
  }

  /**
   * Stops listening for events of the same name as the bound gesture's id.
   */
  stop() {
    this.element.removeEventListener(
      this.gesture.id,
      this.handler,
    );
  }
}

module.exports = Binding;

