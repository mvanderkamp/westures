/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

const CIRCLE_DEGREES = 360;
const HALF_CIRCLE_DEGREES = 180;

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
   * @param x0
   * @param x1
   * @param y0
   * @param y1
   * @returns {Number} The numerical value between two points
   */
  distanceBetweenTwoPoints(x0, x1, y0, y1) {
    return Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0)));
  },

  /**
   * Calculates the midpoint coordinates between two points.
   * @param x0
   * @param x1
   * @param y0
   * @param y1
   * @returns {Array} The coordinates of the midpoint.
   */
  getMidpoint(x0, x1, y0, y1) {
    return {
      x: ((x0 + x1) / 2),
      y: ((y0 + y1) / 2)
    };
  },
  /**
   * Calculates the angle between the projection and an origin point.
   *   |                (projectionX,projectionY)
   *   |             /°
   *   |          /
   *   |       /
   *   |    / θ
   *   | /__________
   *   ° (originX, originY)
   * @param {number} originX
   * @param {number} originY
   * @param {number} projectionX
   * @param {number} projectionY
   * @returns {number} - Degree along the unit circle where the project lies
   */
  getAngle(originX, originY, projectionX, projectionY) {
    var angle = Math.atan2(projectionY - originY, projectionX - originX) * ((HALF_CIRCLE_DEGREES) / Math.PI);
    return CIRCLE_DEGREES - ((angle < 0) ? (CIRCLE_DEGREES + angle) : angle);
  },
  /**
   * Calculates the angular distance in degrees between two angles along the unit circle
   * @param {number} start - The starting point in degrees
   * @param {number} end - The ending point in degrees
   * @returns {number} The number of degrees between the starting point ant ending point. Negative
   * degrees denote a clockwise direction, and positive a counter-clockwise direction.
   */
  getAngularDistance(start, end) {
    var angle = (end - start) % CIRCLE_DEGREES;
    var sign = (angle < 0) ? 1 : -1;
    angle = Math.abs(angle);
    return (angle > HALF_CIRCLE_DEGREES) ? sign * (CIRCLE_DEGREES - angle) : sign * angle;
  }
};
export default util;
