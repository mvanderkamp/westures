/**
 * The API interface for Westures. Defines a number of gestures on top of the
 * engine provided by {@link
 * https://mvanderkamp.github.io/westures-core/index.html|westures-core}.
 *
 * @namespace westures 
 */

'use strict';

const { Gesture, Point2D, Region, Smoothable } = require('westures-core');

const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Swivel  = require('./src/Swivel.js');
const Tap     = require('./src/Tap.js');
const Track   = require('./src/Track.js');

module.exports = {
  Gesture,
  Point2D,
  Region,
  Smoothable,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Swivel,
  Tap,
  Track,
};

/**
 * Here are the return "types" of the gestures that are included in this
 * package.
 *
 * @namespace ReturnTypes
 */

/**
 * The base Gesture class which all other classes extend.
 *
 * @see {@link
 * https://mvanderkamp.github.io/westures-core/westures-core.Gesture.html|
 * westures-core.Gesture}
 *
 * @class Gesture
 * @memberof westures
 */

/**
 * The Region class, which is the entry point for the Westures system, through
 * which you bind handlers with gestures and elements.
 *
 * @see {@link
 * https://mvanderkamp.github.io/westures-core/westures-core.Region.html|
 * westures-core.Region}
 *
 * @class Region
 * @memberof westures
 */

/**
 * Provides some basic operations on two-dimensional points.
 *
 * @see {@link
 * https://mvanderkamp.github.io/westures-core/westures-core.Point2D.html|
 * westures-core.Point2D}
 *
 * @class Point2D
 * @memberof westures
 */

/**
 * Allows the enabling of smoothing on Gestures that use this mixin.
 *
 * @see {@link
 * https://mvanderkamp.github.io/westures-core/westures-core.Smoothable.html|
 * westures-core.Smoothable}
 *
 * @mixin Smoothable
 * @memberof westures
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
 * @property {string} phase - 'start', 'move', or 'end'.
 * @property {number} radius - The distance of the furthest input to the
 * centroid.
 * @property {string} type - The name of the gesture as specified by its
 * designer.
 * @property {Element} target - The bound target of the gesture.
 *
 * @memberof ReturnTypes
 */
