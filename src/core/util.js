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
 * Returns the farthest right input
 *
 * @param {Array} inputs
 *
 * @return {Object}
 */
function getRightMostInput(inputs) {
  let rightMost = null;
  let distance = Number.MIN_VALUE;
  inputs.forEach((input) => {
    if (input.initial.point.x > distance) {
      rightMost = input;
    }
  });
  return rightMost;
}

/**
 * Determines is the value is an integer and not a floating point
 *
 * @param {Mixed} value
 *
 * @return {boolean}
 */
function isInteger(value) {
  return (typeof value === 'number') && (value % 1 === 0);
}

function getMouseButtons({ buttons }) {
  const btns = [];
  for (let mask = 1; mask < 32; mask << 1) {
    const btn = buttons & mask;
    if (btn > 0) btns.push(btn);
  }
  return btns;
}

/**
 * Polyfill for event.propagationPath
 *
 * @param {Event} event
 *
 * @return {Array}
 */
function getPropagationPath(event) {
  if (event.path) {
    return event.path;
  } else {
    let path = [];
    let node = event.target;
    while (node != document) {
      path.push(node);
      node = node.parentNode;
    }

    return path;
  }
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
  isInteger,
  preventDefault,
  removeMSPreventDefault,
  setMSPreventDefault,
  getPathIndex,
  getPropagationPath,
  getRightMostInput,
  getMouseButtons,
});
