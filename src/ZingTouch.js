/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

const Region = require('./core/classes/Region.js');
const Gesture = require('./gestures/Gesture.js');
const Pan = require('./gestures/Pan.js');
const Pinch = require('./gestures/Pinch.js');
const Rotate = require('./gestures/Rotate.js');
const Swipe = require('./gestures/Swipe.js');
const Tap = require('./gestures/Tap.js');

/**
 * The global API interface for ZingTouch. Contains a constructor for the
 * Region Object, and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace ZingTouch
 */
let ZingTouch = {
  _regions: [],

  // Constructors
  Gesture: Gesture,
  Pan: Pan,
  Pinch: Pinch,
  Rotate: Rotate,
  Swipe: Swipe,
  Tap: Tap,
  Region: function(element, capture, preventDefault) {
    let id = ZingTouch._regions.length;
    let region = new Region(element, capture, preventDefault, id);
    ZingTouch._regions.push(region);
    return region;
  },
};

module.exports = ZingTouch;
