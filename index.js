/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

const Region  = require('./src/core/classes/Region.js');
const Gesture = require('./src/core/classes/Gesture.js');
const Pan     = require('./src/gestures/Pan.js');
const Pinch   = require('./src/gestures/Pinch.js');
const Rotate  = require('./src/gestures/Rotate.js');
const Swipe   = require('./src/gestures/Swipe.js');
const Tap     = require('./src/gestures/Tap.js');

// Currently keeping track of all regions.
const regions = [];

/**
 * The global API interface for ZingTouch. Contains a constructor for the
 * Region Object, and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace ZingTouch
 */
const ZingTouch = {
  Gesture,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Tap,
  Region: function(element, capture, preventDefault) {
    const id = regions.length;
    const region = new Region(element, capture, preventDefault, id);
    regions.push(region);
    return region;
  },
};

module.exports = ZingTouch;
