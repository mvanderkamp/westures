/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

const Region  = require('./src/core/Region.js');
const Gesture = require('./src/core/Gesture.js');
const Pan     = require('./src/gestures/Pan.js');
const Pinch   = require('./src/gestures/Pinch.js');
const Rotate  = require('./src/gestures/Rotate.js');
const Swipe   = require('./src/gestures/Swipe.js');
const Tap     = require('./src/gestures/Tap.js');

/**
 * The global API interface for ZingTouch. Contains a constructor for the
 * Region Object, and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace ZingTouch
 */
module.exports = {
  Gesture,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Tap,
  Region,
};

