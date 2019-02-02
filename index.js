/**
 * The API interface for Westures. Contains the {@link Region} class, a {@link
 * Point2D} class, the {@link Gesture} interface, and the following predefined
 * gestures: {@link Pan}, {@link Pinch}, {@link Rotate}, {@link Swipe}, {@link
 * Swivel}, {@link Tap}, {@link Track}.
 *
 * @module westures 
 */

'use strict';

const { Gesture, Point2D, Region } = require('westures-core');
const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Swivel  = require('./src/Swivel.js');
const Tap     = require('./src/Tap.js');
const Track   = require('./src/Track.js');

module.exports = {
  /** {@link Gesture} */  Gesture,
  /** {@link Point2D} */  Point2D,
  /** {@link Region} */   Region,
  /** {@link Pan} */      Pan,
  /** {@link Pinch} */    Pinch,
  /** {@link Rotate} */   Rotate,
  /** {@link Swipe} */    Swipe,
  /** {@link Swivel} */   Swivel,
  /** {@link Tap} */      Tap,
  /** {@link Track} */    Track,
};

