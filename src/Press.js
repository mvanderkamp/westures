/*
 * Contains the Press class.
 */

'use strict';

const { Gesture, Point2D, MOVE } = require('../core');

/**
 * Data returned when a Press is recognized.
 *
 * @typedef {Object} PressData
 *
 * @property {westures-core.Point2D} centroid - The current centroid of the
 * input points.
 * @property {westures-core.Point2D} initial - The initial centroid of the input
 * points.
 * @property {number} distance - The total movement since initial contact.
 *
 * @memberof ReturnTypes
 */

/**
 * A Press is defined as one or more input points being held down without
 * moving. Press gestures may be stacked by pressing with additional pointers
 * beyond the minimum, so long as none of the points move or are lifted, a Press
 * will be recognized for each additional pointer.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PressData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {number} [options.delay=1000] - The delay before emitting, during
 * which time the number of inputs must not go below minInputs.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move and still allow the gesture to emit.
 */
class Press extends Gesture {
  constructor(element, handler, options = {}) {
    options = { ...Press.DEFAULTS, ...options };
    super('press', element, handler, options);

    /**
     * The delay before emitting a press event, during which time the number of
     * inputs must not change.
     *
     * @type {number}
     */
    this.delay = options.delay;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Press gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance;
  }

  start(state) {
    const initial = state.centroid;
    const identifiers = new Set(state.active.map(i => i.identifier));
    setTimeout(() => {
      const inputs = state.active.filter(i => identifiers.has(i.identifier));
      const centroid = Point2D.centroid(inputs.map(i => i.current.point));

      // Due to the timeout, possible that centroid is null...
      if (centroid != null) {
        const distance = initial.distanceTo(centroid);
        if (distance <= this.tolerance && inputs.length === identifiers.size) {
          this.recognize(MOVE, state, { centroid, distance, initial });
        }
      }
    }, this.delay);
  }
}

Press.DEFAULTS = Object.freeze({
  delay:     1000,
  tolerance: 10,
});

module.exports = Press;

