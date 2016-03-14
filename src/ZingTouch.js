/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

import Listener from './core/classes/Listener.js';
import Gesture from './gestures/Gesture.js';
import Expand from './gestures/Expand.js';
import Pan from './gestures/Pan.js';
import Pinch from './gestures/Pinch.js';
import Rotate from './gestures/Rotate.js';
import Swipe from './gestures/Swipe.js';
import Tap from './gestures/Tap.js';

/**
 * The global API interface for ZingTouch
 * @type {Object}
 * @namespace ZingTouch
 */
var ZingTouch = {
  //Constructors
  Listener: Listener,
  Gesture: Gesture,
  Expand: Expand,
  Pan: Pan,
  Pinch: Pinch,
  Rotate: Rotate,
  Swipe: Swipe,
  Tap: Tap
};

export default ZingTouch;
