/**
 * @file Binding.js
 */

/**
 * Responsible for creating a binding between an element and a gesture.
 * @class Binding
 */
class Binding {
  /**
   * Constructor function for the Binding class.
   * @param {Element} element - The element to associate the gesture to.
   * @param {Gesture} gesture - A instance of the Gesture type.
   * @param {Function} handler - The function handler to execute when a
   * gesture is recognized
   * on the associated element.
   * @param {Boolean} [capture=false] - A boolean signifying if the event is
   * to be emitted during
   * the capture or bubble phase.
   * @param {Boolean} [bindOnce=false] - A boolean flag
   * used for the bindOnce syntax.
   */
  constructor(element, gesture, handler, capture = false, bindOnce = false) {
    /**
     * The element to associate the gesture to.
     * @type {Element}
     */
    this.element = element;

    /**
     * A instance of the Gesture type.
     * @type {Gesture}
     */
    this.gesture = gesture;

    /**
     * The function handler to execute when a gesture is
     * recognized on the associated element.
     * @type {Function}
     */
    this.handler = handler;

    /**
     * A boolean signifying if the event is to be
     * emitted during the capture or bubble phase.
     * @type {Boolean}
     */
    this.capture = capture;

    /**
     * A boolean flag used for the bindOnce syntax.
     * @type {Boolean}
     */
    this.bindOnce = bindOnce;

    // Start listening immediately.
    this.listen();
  }

  dispatch(data) {
    const emittable = new CustomEvent(this.gesture.id, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });
    this.element.dispatchEvent(emittable);
  }

  listen() {
    this.element.addEventListener(
      this.gesture.id,
      this.handler,
      this.capture
    );
  }
}

module.exports = Binding;
