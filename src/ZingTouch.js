/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
*/

import Region from './core/classes/Region.js';
import Gesture from './gestures/Gesture.js';
import Expand from './gestures/Expand.js';
import Pan from './gestures/Pan.js';
import Pinch from './gestures/Pinch.js';
import Press from './gestures/Press.js';
import Rotate from './gestures/Rotate.js';
import Swipe from './gestures/Swipe.js';
import Tap from './gestures/Tap.js';

/**
 * The global API interface for ZingTouch. Contains a constructor for the Region Object,
 * and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace ZingTouch
 */
var ZingTouch = {
  //Constructors
  Region: Region,
  Gesture: Gesture,
  Expand: Expand,
  Pan: Pan,
  Pinch: Pinch,
  Press: Press,
  Rotate: Rotate,
  Swipe: Swipe,
  Tap: Tap
};

export default ZingTouch;
