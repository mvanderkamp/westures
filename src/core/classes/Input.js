/**
 * Hold important input information and normalizes events across browsers.
 */
class Input {
  constructor(event) {
    this.initialTarget = event.target;
    this.initialEvent = event;
    this.type = this.normalizeEvent(event.type);
    this.x = event.x;
    this.y = event.y;
  }

  /**
   * Normalize mouse and other input types to be touch.
   * @param {string}
   * @returns {string} - The type of mouse event
   */
  normalizeEvent(type) {
    switch (type) {
      case 'mousedown' :
      case 'touchstart' :
        return 'start';
        break;
      case 'mousemove' :
      case 'touchmove' :
        return 'move';
        break;
      case 'mouseup' :
      case 'touchend' :
        return 'end';
        break;
      default :
        return null;
    }
  }
}

export default Input;
