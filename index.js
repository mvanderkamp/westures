/**
 * The API interface for Westures. Defines a number of gestures on top of the
 * engine provided by {@link
 * https://mvanderkamp.github.io/westures-core/index.html|westures-core}.
 *
 * @namespace westures
 */

'use strict';

const core = require('./core');

const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Press   = require('./src/Press.js');
const Pull    = require('./src/Pull.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Swivel  = require('./src/Swivel.js');
const Tap     = require('./src/Tap.js');
const Track   = require('./src/Track.js');

module.exports = {
  Pan,
  Pinch,
  Press,
  Pull,
  Rotate,
  Swipe,
  Swivel,
  Tap,
  Track,
  ...core,
};

/**
 * Here are the return "types" of the gestures that are included in this
 * package.
 *
 * @namespace ReturnTypes
 */

/**
 * The base data that is included for all emitted gestures.
 *
 * @typedef {Object} BaseData
 *
 * @property {westures-core.Point2D} centroid - The centroid of the input
 * points.
 * @property {Event} event - The input event which caused the gesture to be
 * recognized.
 * @property {string} phase - 'start', 'move', 'end', or 'cancel'.
 * @property {string} type - The name of the gesture as specified by its
 * designer.
 * @property {Element} target - The bound target of the gesture.
 *
 * @memberof ReturnTypes
 */

