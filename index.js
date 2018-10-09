/**
 * @file Westures.js
 * Main object containing API methods and Gesture constructors
 */

const { Region, Gesture }  = require('../westures-core/index.js');
const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Tap     = require('./src/Tap.js');

/**
 * The global API interface for Westures. Contains a constructor for the
 * Region Object, and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace Westures
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

