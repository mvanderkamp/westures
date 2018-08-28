/**
 * @File Point2D.js
 *
 * Defines a 2D point class.
 */

/**
 * The Point2D class stores and operates on 2-dimensional points, represented as
 * x and y coordinates.
 */
class Point2D {
  /**
   * Constructor function for the Point2D class.
   */
  constructor(x, y) {
    /**
     * The horizontal (x) coordinate of the point.
     *
     * @type {Number}
     */
    this.x = x;

    /**
     * The vertical (y) coordinate of the point.
     *
     * @type {Number}
     */
    this.y = y;
  }

  add(point) {
    return new Point2D(
      this.x + point.x,
      this.y + point.y,
    );
  }

  subtract(point) {
    return new Point2D(
      this.x - point.x,
      this.y - point.y
    );
  }

  /**
   * Determines if the distance from this point to a given point is within or up
   * to a certain tolerance.
   *
   * @param {Point2D} point - The point to examine the distance of.
   * @param {Number} tolerance - The tolerance in pixel value.
   *
   * @return {Boolean} - true if the current coordinates are within the
   * tolerance, false otherwise
   */
  distanceToPointIsWithinTolerance(point, tolerance) {
    return this.distanceTo(point) <= tolerance;
  }

  /**
   * Calculates the distance between two points.
   *
   * @param {Point2D} point
   *
   * @return {number} The distance between the two points, a.k.a. the
   * hypoteneuse. 
   */
  distanceTo(point) {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  /**
   * Calculates the midpoint coordinates between two points.
   *
   * @param {Point2D} point
   *
   * @return {Object} The coordinates of the midpoint.
   */
  midpointTo(point) {
    return new Point2D(
      (this.x + point.x) / 2,
      (this.y + point.y) / 2,
    );
  }

  /**
   * Calculates the angle between this point and the given point.
   *   |                (projectionX,projectionY)
   *   |             /°
   *   |          /
   *   |       /
   *   |    / θ
   *   | /__________
   *   ° (originX, originY)
   *
   * @param {Point2D} point
   *
   * @return {Number} - Degree along the unit circle where the projection lies.
   */
  angleTo(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }

  /**
   * Determines if this point is within the given HTML element.
   *
   * @param {Element} target
   *
   * @return {Boolean}
   */
  isInside(element) {
    const rect = element.getBoundingClientRect();
    return (
      this.x >= rect.left &&
      this.x <= (rect.left + rect.width) &&
      this.y >= rect.top &&
      this.y <= (rect.top + rect.height)
    );
  }
}

Point2D.clone = function(point) {
  return new Point2D(point.x, point.y);
}

module.exports = Point2D;
