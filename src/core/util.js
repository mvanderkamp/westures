/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

var util = {

  /**
   * Normalizes window events to be either of type start, move, or end.
   * @param {String} type - The event type emitted by the browser
   * @returns {null|String} - The normalized event, or null if it is an event not predetermined.
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
  },
  /*normalizeEvent*/

  /**
   * Determines if the current and previous coordinates are within or up to a certain tolerance.
   * @param {Number} currentX - Current event's x coordinate
   * @param {Number} currentY - Current event's y coordinate
   * @param {Number} previousX - Previous event's x coordinate
   * @param {Number} previousY - Previous event's y coordinate
   * @param {Number} tolerance - The tolerance in pixel value.
   * @returns {boolean} - true if the current coordinates are within the tolerance, false otherwise
   */
  isWithin(currentX, currentY, previousX, previousY, tolerance) {
    return ((Math.abs(currentY - previousY) <= tolerance) && (Math.abs(currentX - previousX) <= tolerance));
  },
  /*isWithin*/

  /**
   * Calculates the distance between two points.
   * @returns {Number} The numerical value between two points
   */
  distanceBetweenTwoPoints(x0, x1, y0, y1) {
    return Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0)));
  }
};
export default util;
