/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

/**
 * Normalizes window events to be either of type start, move, or end.
 *
 * @param {String} type - The event type emitted by the browser
 *
 * @return {null|String} - The normalized event, or null if it is an event not
 * predetermined.
 */
const normalizeEvent = Object.freeze({
  mousedown:   'start',
  touchstart:  'start',
  pointerdown: 'start',

  mousemove:   'move',
  touchmove:   'move',
  pointermove: 'move',

  mouseup:   'end',
  touchend:  'end',
  pointerup: 'end',
});
/* normalizeEvent*/

/**
 * @return {Array} Identifiers of the mouse buttons used.
 */
function getMouseButtons(event) {
  const btns = [];
  if (event && event.buttons) {
    for (let mask = 1; mask < 32; mask <<= 1) {
      const btn = event.buttons & mask;
      if (btn > 0) btns.push(btn);
    }
  }
  return btns;
}

/**
 * Retrieve the index of the element inside the path array.
 *
 * @param {Array} path
 * @param {Element} element
 *
 * @return {Number} The index of the element, or the path length if not found.
 */
function getPathIndex(path, element) {
  const index = path.indexOf(element);
  return index < 0 ? path.length : index;
}

/**
 * In case event.composedPath() is not available.
 *
 * @param {Event} event
 *
 * @return {Array}
 */
function getPropagationPath(event) {
  if (typeof event.composedPath === 'function') {
    return event.composedPath();
  } 

  const path = [];
  for (let node = event.target; node !== document; node = node.parentNode) {
    path.push(node);
  }
  path.push(document);
  path.push(window);

  return path;
}

function setMSPreventDefault(element) {
  element.style['-ms-content-zooming'] = 'none';
  element.style['touch-action'] = 'none';
}

function removeMSPreventDefault(element) {
  element.style['-ms-content-zooming'] = '';
  element.style['touch-action'] = '';
}

function preventDefault(event) {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

module.exports = Object.freeze({
  normalizeEvent,
  preventDefault,
  removeMSPreventDefault,
  setMSPreventDefault,
  getPathIndex,
  getPropagationPath,
  getMouseButtons,
});

