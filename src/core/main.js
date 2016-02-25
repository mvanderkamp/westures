import ZingTouch from './../ZingTouch.js';
import arbiter from './arbiter.js';

//Perform polyfills and setup window listeners.
var eventNames = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
eventNames.forEach(function () {
  document.addEventListener(val, (event) => {
    arbiter(event);
  });
});

window.ZingTouch = ZingTouch;
export {ZingTouch};

