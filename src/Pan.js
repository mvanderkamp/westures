/*
 * Contains the Pan class.
 */

'use strict';

const { Gesture, Point2D, Smoothable } = require('westures-core');

/**
 * Data returned when a Pan is recognized.
 *
 * @typedef {Object} PanData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D} translation - The change vector from the last
 * emit.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pan is defined as a normal movement in any direction.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PanData}
 * @memberof westures
 *
 * @param {Element} element - The element with which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of
 * keys whicyh will disable the gesture. The gesture will not be recognized if
 * one of these keys is pressed. If not specified or an empty list, the gesture
 * is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 */
class Pan extends Gesture {
  constructor(element, handler, options = {}) {
    const settings = { ...Pan.DEFAULTS, ...options };
    super('pan', element, handler, settings);

    /**
     * The previous point location.
     *
     * @private
     * @type {westures.Point2D}
     */
    this.previous = null;

    /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @private
     * @override
     * @type {westures-core.Smoothable<westures-core.Point2D>}
     */
    this.outgoing = new Smoothable({ ...settings, identity: new Point2D() });
    this.outgoing.average = (a, b) => Point2D.centroid([a, b]);
  }

  /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @private
   * @param {State} state - The state object received by a hook.
   */
  restart(state) {
    this.previous = state.centroid;
    this.outgoing.restart();
  }

  /**
   * Event hook for the start of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Pan.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PanData} <tt>null</tt> if the gesture was muted or
   * otherwise not recognized.
   */
  move(state) {
    const translation = state.centroid.minus(this.previous);
    this.previous = state.centroid;

    return { translation: this.outgoing.next(translation) };
  }

  /**
   * Event hook for the end of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Pan. Resets the current centroid of
   * the inputs.
   *
   * @private
   */
  cancel() {
    this.previous = null;
    this.outgoing.restart();
  }
}

Pan.DEFAULTS = Object.freeze({
  minInputs: 1,
  smoothing: true,
});

module.exports = Pan;

