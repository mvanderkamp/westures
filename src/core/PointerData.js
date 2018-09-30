/**
 * @file PointerData.js
 * Contains logic for PointerDatas
 */

const util    = require('./util.js');
const Point2D = require('./Point2D.js');

/**
 * Low-level storage of pointer data based on incoming data from an interaction
 * event.
 *
 * @class PointerData
 */
class PointerData {
  /**
   * @constructor
   *
   * @param {Event} event - The event object being wrapped.
   * @param {Array} event.touches - The number of touches on a screen (mobile
   *    only).
   * @param {Object} event.changedTouches - The TouchList representing points
   *    that participated in the event.
   * @param {Number} touchIdentifier - The index of touch if applicable
   */
  constructor(event, identifier) {
    /**
     * The set of elements along the original event's propagation path at the
     * time it was dispatched.
     *
     * @type {WeakSet}
     */
    this.initialElements = getInitialElementsInPath(event);

    /**
     * The original event object.
     *
     * @type {Event}
     */
    this.originalEvent = event;

    /**
     * The type or 'phase' of this batch of pointer data. 'start' or 'move' or
     * 'end'.
     *
     * @type {String | null}
     */
    this.type = util.normalizeEvent[ event.type ];

    /**
     * The timestamp of the event in milliseconds elapsed since January 1, 1970,
     * 00:00:00 UTC.
     * 
     * @type {Number}
     */
    this.time = Date.now();

    /**
     * The (x,y) coordinate of the event, wrapped in a Point2D.
     */
    const eventObj = getEventObject(event, identifier);
    this.point = new Point2D(eventObj.clientX, eventObj.clientY);
  }

  /**
   * Calculates the angle between this event and the given event.
   *
   * @param {PointerData} pdata
   *
   * @return {Number} - Radians measurement between this event and the given
   *    event's points.
   */
  angleTo(pdata) {
    return this.point.angleTo(pdata.point);
  }

  /**
   * Calculates the distance between two PointerDatas.
   *
   * @param {PointerData} pdata
   *
   * @return {Number} The distance between the two points, a.k.a. the
   *    hypoteneuse. 
   */
  distanceTo(pdata) {
    return this.point.distanceTo(pdata.point);
  }

  /**
   * Determines if this PointerData is within the given HTML element.
   *
   * @param {Element} target
   *
   * @return {Boolean}
   */
  isInside(element) {
    return this.point.isInside(element);
  }

  /**
   * Calculates the midpoint coordinates between two PointerData objects.
   *
   * @param {PointerData} pdata
   *
   * @return {Point2D} The coordinates of the midpoint.
   */
  midpointTo(pdata) {
    return this.point.midpointTo(pdata.point);
  }

  /**
   * Determines if this PointerData was inside the given element at the time it
   * was dispatched.
   *
   * @param {Element} element
   *
   * @return {Boolean} true if the PointerData occurred inside the element,
   *    false otherwise.
   */
  wasInside(element) {
    return this.initialElements.has(element);
  }
}

/**
 * @return {Event} The Event object which corresponds to the given identifier.
 *    Contains clientX, clientY values.
 */
function getEventObject(event, identifier) {
  if (event.changedTouches) {
    return Array.from(event.changedTouches).find( t => {
      return t.identifier === identifier;
    });
  } 
  return event;
}

/**
 * @return {WeakSet} The Elements in the path of the given event.
 */
function getInitialElementsInPath(event) {
  // A WeakSet is used so that references will be garbage collected when the
  // element they point to is removed from the page.
  const set = new WeakSet();
  const path = util.getPropagationPath(event);
  path.forEach( node => set.add(node) );
  return set;
}

module.exports = PointerData;

