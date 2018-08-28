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
 * Determines if the current and previous coordinates are within or up to a
 * certain tolerance.
 *
 * @param {Number} currentX - Current event's x coordinate
 * @param {Number} currentY - Current event's y coordinate
 * @param {Number} previousX - Previous event's x coordinate
 * @param {Number} previousY - Previous event's y coordinate
 * @param {Number} tolerance - The tolerance in pixel value.
 *
 * @return {boolean} - true if the current coordinates are within the tolerance,
 * false otherwise
 */
function isWithin(currentX, currentY, previousX, previousY, tolerance) {
  const dx = Math.abs(currentX - previousX);
  const dy = Math.abs(currentY - previousY);
  return (dx <= tolerance) && (dy <= tolerance);
}
/* isWithin*/

/**
 * Calculates the distance between two points.
 *
 * @param {Number} x0
 * @param {Number} x1
 * @param {Number} y0
 * @param {Number} y1
 *
 * @return {number} The numerical value between two points
 */
function distanceBetweenTwoPoints(x0, x1, y0, y1) {
  return Math.hypot(x0 - x1, y0 - y1);
}

/**
 * Calculates the midpoint coordinates between two points.
 *
 * @param {Number} x0
 * @param {Number} x1
 * @param {Number} y0
 * @param {Number} y1
 *
 * @return {Object} The coordinates of the midpoint.
 */
function getMidpoint(x0, x1, y0, y1) {
  return {
    x: ((x0 + x1) / 2),
    y: ((y0 + y1) / 2),
  };
}

/**
 * Calculates the angle between the projection and an origin point.
 *   |                (projectionX,projectionY)
 *   |             /°
 *   |          /
 *   |       /
 *   |    / θ
 *   | /__________
 *   ° (originX, originY)
 *
 * @param {number} originX
 * @param {number} originY
 * @param {number} projectionX
 * @param {number} projectionY
 *
 * @return {number} - Degree along the unit circle where the project lies
 */

function getAngle(originX, originY, projectionX, projectionY) {
  return Math.atan2(projectionY - originY, projectionX - originX);
}

/**
 * Calculates the velocity of pixel/milliseconds between two points
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} startTime
 * @param {Number} endX
 * @param {Number} endY
 * @param {Number} endTime
 * @return {Number} velocity of px/time
 */
function getVelocity(startX, startY, startTime, endX, endY, endTime) {
  let distance = distanceBetweenTwoPoints(startX, endX, startY, endY);
  return (distance / (endTime - startTime));
}

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
    if (input.initial.x > distance) {
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

/**
 * Determines if the x,y position of the input is within then target.
 *
 * @param {Number} x -clientX
 * @param {Number} y -clientY
 * @param {Element} target
 *
 * @return {Boolean}
 */
function isInside(x, y, target) {
  const rect = target.getBoundingClientRect();
  return ((x > rect.left && x < rect.left + rect.width) &&
    (y > rect.top && y < rect.top + rect.height));
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
  isWithin,
  isInside,
  isInteger,
  distanceBetweenTwoPoints,
  preventDefault,
  removeMSPreventDefault,
  setMSPreventDefault,
  getPathIndex,
  getPropagationPath,
  getRightMostInput,
  getVelocity,
  getMouseButtons,
  getAngle,
  getMidpoint,
});
