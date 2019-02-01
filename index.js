/**
 * @file Main module containing API methods and Gesture constructors.
 */

'use strict';

const Core    = require('westures-core');
const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Swivel  = require('./src/Swivel.js');
const Tap     = require('./src/Tap.js');
const Track   = require('./src/Track.js');

/**
 * The global API interface for Westures. Contains the {@link 
 * https://mvanderkamp.github.io/westures-core/Region.html Region} class, a
 * {@link https://mvanderkamp.github.io/westures-core/Point2D.html Point2D}
 * class, the {@link https://mvanderkamp.github.io/westures-core/Gesture.html
 * Gesture} interface, and the following predefined gestures: {@link Pan},
 * {@link Pinch}, {@link Rotate}, {@link Swipe}, {@link Swivel}, {@link Tap},
 * {@link Track}.
 *
 * @module westures
 */
module.exports = {
  ...Core,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Swivel,
  Tap,
  Track,
};

