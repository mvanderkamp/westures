/**
 * @file main.js
 * Main file to setup event listeners on the document, and to expose the ZingTouch object
 */

import ZingTouch from './../ZingTouch.js';
import arbiter from './arbiter.js';

//Perform polyfills and setup window listeners.
var eventNames = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];

//noinspection JSUnusedLocalSymbols
eventNames.forEach((val, index, arr) => {
  document.addEventListener(val, (event) => {
    arbiter(event);
  });
});

window.ZingTouch = ZingTouch;
export {ZingTouch};

