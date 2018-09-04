/**
 * @file Input.js
 */

const ZingEvent = require('./ZingEvent.js');

/**
 * Tracks a single input and contains information about the
 * current, previous, and initial events.
 * Contains the progress of each Input and it's associated gestures.
 * @class Input
 */
class Input {
  /**
   * Constructor function for the Input class.
   * @param {Event} event - The Event object from the window
   * @param {Number} [identifier=0] - The identifier for each input event
   * (taken from event.changedTouches)
   */
  constructor(event, identifier = 0) {
    const currentEvent = new ZingEvent(event, identifier);

    /**
     * Holds the initial event object. A touchstart/mousedown event.
     * @type {ZingEvent}
     */
    this.initial = currentEvent;

    /**
     * Holds the most current event for this Input, disregarding any other past,
     * current, and future events that other Inputs participate in.
     * e.g. This event ended in an 'end' event, but another Input is still
     * participating in events -- this will not be updated in such cases.
     * @type {ZingEvent}
     */
    this.current = currentEvent;

    /**
     * Holds the previous event that took place.
     * @type {ZingEvent}
     */
    this.previous = currentEvent;

    /**
     * The identifier for the pointer / touch / mouse button associated with
     * this event.
     * @type {Number}
     */
    this.identifier = identifier;

    /**
     * Stores internal state between events for
     * each gesture based off of the gesture's id.
     * @type {Object}
     */
    this.progress = {};
  }

  /**
   * @return {String} The phase of the input: 'start' or 'move' or 'end'
   */
  get phase()       { return this.current.type; }

  /**
   * @return {Number} The timestamp of the most current event for this input.
   */
  get currentTime() { return this.current.time; }

  /**
   * @return {Number} The timestamp of the initiating event for this input.
   */
  get startTime()   { return this.initial.time; }

  /**
   * Determines the distance between the current events for two inputs.
   *
   * @return {Number} The distance between the inputs' current events.
   */
  currentDistanceTo(input) {
    return this.current.distanceTo(input.current);
  }

  /**
   * @return {Number} The midpoint between the inputs' current events.
   */
  currentMidpointTo(input) {
    return this.current.midpointTo(input.current);
  }

  /**
   * @param {String} id - The identifier for each unique Gesture's progress.
   *
   * @return {Object} - The progress of the gesture.
   */
  getProgressOfGesture(id) {
    if (!this.progress[id]) {
      this.progress[id] = {};
    }
    return this.progress[id];
  }

  /**
   * @return {Number} The angle, in radians, between the initiating event for
   * this input and its current event.
   */
  totalAngle() {
    return this.initial.angleTo(this.current);
  }

  /**
   * @return {Number} The distance between the initiating event for this input
   * and its current event.
   */
  totalDistance() {
    return this.initial.distanceTo(this.current);
  }

  /**
   * @return {Boolean} true if the total distance is less than or equal to the
   * tolerance.
   */
  totalDistanceIsWithin(tolerance) {
    return this.totalDistance() <= tolerance;
  }

  /**
   * Saves the given raw event in ZingEvent form as the current event for this
   * input, pushing the old current event into the previous slot, and tossing
   * out the old previous event.
   *
   * @param {Event} event - The event object to wrap with a ZingEvent.
   * @param {Number} touchIdentifier - The index of inputs, from event.touches
   */
  update(event, identifier) {
    this.previous = this.current;
    this.current = new ZingEvent(event, identifier);
  }

  /**
   * @return {Boolean} true if the given element existed along the propagation
   * path of this input's initiating event.
   */
  wasInitiallyInside(element) {
    return this.initial.wasInside(element);
  }
}

module.exports = Input;
