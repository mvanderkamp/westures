/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

const Region  = require('./core/classes/Region.js');
const Gesture = require('./gestures/Gesture.js');
const Pan     = require('./gestures/Pan.js');
const Pinch   = require('./gestures/Pinch.js');
const Rotate  = require('./gestures/Rotate.js');
const Swipe   = require('./gestures/Swipe.js');
const Tap     = require('./gestures/Tap.js');

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
