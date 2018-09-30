/**
 * @File Point2D.js
 *
 * Defines a 2D point class.
 */

/**
 * The Point2D class stores and operates on 2-dimensional points, represented as
 * x and y coordinates.
 *
 * @class Point2D
 */
class Point2D {
  /**
   * Constructor function for the Point2D class.
   */
  constructor(x = 0, y = 0) {
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

  /**
   * Add this point to the given point.
   *
   * @param {Point2D} point
   *
   * @return {Point2D} A new Point2D, which is the addition of the two points.
   */
  add(point) {
    return new Point2D(
      this.x + point.x,
      this.y + point.y,
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
   * @param {Point2D} point - The projection
   *
   * @return {Number} - Radians along the unit circle where the projection lies.
   */
  angleTo(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }

  /**
   * Determine the average distance from this point to the provided array of
   * points.
   *
   * @param {Array} points - the Point2D objects to calculate the average
   *    distance to.
   *
   * @return {Number} The average distance from this point to the provided
   *    points.
   */
  averageDistanceTo(points = []) {
    return this.totalDistanceTo(points) / points.length;
  }

  /**
   * Clone this point.
   *
   * @return {Point2D} A new Point2D, identical to this point.
   */
  clone() {
    return new Point2D(this.x, this.y);
  }

  /**
   * Calculates the distance between two points.
   *
   * @param {Point2D} point
   *
   * @return {number} The distance between the two points, a.k.a. the
   *    hypoteneuse. 
   */
  distanceTo(point) {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  /**
   * Determines if this point is within the given HTML element.
   *
   * @param {Element} target
   *
   * @return {Boolean} true if the given point is within element, false
   *    otherwise. 
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

  /**
   * Calculates the midpoint coordinates between two points.
   *
   * @param {Point2D} point
   *
   * @return {Point2D} The coordinates of the midpoint.
   */
  midpointTo(point) {
    return new Point2D(
      (this.x + point.x) / 2,
      (this.y + point.y) / 2,
    );
  }

  /**
   * Subtract the given point from this point.
   *
   * @param {Point2D} point
   *
   * @return {Point2D} A new Point2D, which is the result of (this - point).
   */
  subtract(point) {
    return new Point2D(
      this.x - point.x,
      this.y - point.y
    );
  }

  /**
   * Calculates the total distance from this point to an array of points.
   *
   * @param {Array} points - The array of Point2D objects to calculate the total
   *    distance to.
   *
   * @return {Number} The total distance from this point to the provided points.
   */
  totalDistanceTo(points = []) {
    return points.reduce( (d, p) => d + this.distanceTo(p), 0);
  }
}

/**
 * Calculates the midpoint of a list of points.
 *
 * @param {Array} points - The array of Point2D objects for which to calculate
 *    the midpoint
 *
 * @return {Point2D} The midpoint of the provided points.
 */
Point2D.midpoint = function(points = []) {
  if (points.length === 0) throw 'Need points to exist to calculate midpoint!';
  const total = Point2D.sum(points);
  return new Point2D (
    total.x / points.length,
    total.y / points.length,
  );
}

/**
 * Calculates the sum of the given points.
 *
 * @param {Array} points - The Point2D objects to sum up.
 *
 * @return {Point2D} A new Point2D representing the sum of the given points.
 */
Point2D.sum = function(points = []) {
  return points.reduce( (total, current) => {
    total.x += current.x;
    total.y += current.y;
    return total;
  }, new Point2D(0,0) );
}

module.exports = Point2D;

