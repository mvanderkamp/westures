/**
 * @file ZingEvent.js
 * Contains logic for ZingEvents
 */

const util    = require('../util.js');
const Point2D = require('./Point2D.js');

/**
 * An event wrapper that normalizes events across browsers and input devices
 * @class ZingEvent
 */
class ZingEvent {
  /**
   * @constructor
   * @param {Event} event - The event object being wrapped.
   * @param {Array} event.touches - The number of touches on
   *  a screen (mobile only).
   * @param {Object} event.changedTouches - The TouchList representing
   * points that participated in the event.
   * @param {Number} touchIdentifier - The index of touch if applicable
   */
  constructor(event, touchIdentifier) {
    const eventObj = getEventObject(event, touchIdentifier);

    /**
     * The original event object.
     * @type {Event}
     */
    this.originalEvent = event;

    /**
     * The type of event or null if it is an event not predetermined.
     * @see util.normalizeEvent
     * @type {String | null}
     */
    this.type = util.normalizeEvent[ event.type ];

    /**
     * Various x,y coordinates extracted from the inner event.
     */
    this.clientX = eventObj.clientX;
    this.clientY = eventObj.clientY;
    
    this.pageX = eventObj.pageX;
    this.pageY = eventObj.pageY;

    this.screenX = eventObj.screenX;
    this.screenY = eventObj.screenY;

    /**
     * The (x,y) coordinate of the event, wrapped in a Point2D.
     */
    this.point = new Point2D(this.clientX, this.clientY);
  }

  /**
   * Calculates the angle between this event and the given event.
   *   |                (projectionX,projectionY)
   *   |             /°
   *   |          /
   *   |       /
   *   |    / θ
   *   | /__________
   *   ° (originX, originY)
   *
   * @param {ZingEvent} event
   *
   * @return {Number} - Degree along the unit circle where the projection lies.
   */
  angleTo(event) {
    return this.point.angleTo(event.point);
  }

  /**
   * Calculates the distance between two ZingEvents.
   *
   * @param {ZingEvent} event
   *
   * @return {number} The distance between the two points, a.k.a. the
   * hypoteneuse. 
   */
  distanceTo(event) {
    return this.point.distanceTo(event.point);
  }

  /**
   * Calculates the midpoint coordinates between two events.
   *
   * @param {ZingEvent} event
   *
   * @return {Point2D} The coordinates of the midpoint.
   */
  midpointTo(event) {
    return this.point.midpointTo(event.point);
  }
}

function getEventObject(event, identifier) {
  if (event.touches && event.changedTouches) {
    return Array.from(event.changedTouches).find( t => {
      return t.identifier === identifier;
    });
  } 
  return event;
}

module.exports = ZingEvent;
