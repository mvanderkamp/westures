(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.westures = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * The API interface for Westures. Defines a number of gestures on top of the
 * engine provided by {@link
 * https://mvanderkamp.github.io/westures-core/index.html|westures-core}.
 *
 * @namespace westures 
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
  Gesture,
  Point2D,
  Region,
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
 * The base data that is included for all emitted gestures.
 *
 * @typedef {Object} BaseData
 *
 * @property {Event} event - The input event which caused the gesture to be
 *    recognized.
 * @property {string} phase - 'start', 'move', or 'end'.
 * @property {string} type - The name of the gesture as specified by its
 *    designer.
 * @property {Element} target - The bound target of the gesture.
 *
 * @memberof ReturnTypes
 */

},{"./src/Pan.js":11,"./src/Pinch.js":12,"./src/Rotate.js":13,"./src/Swipe.js":14,"./src/Swivel.js":15,"./src/Tap.js":16,"./src/Track.js":17,"westures-core":2}],2:[function(require,module,exports){
/**
 * The global API interface for Westures. Exposes a constructor for the
 * {@link Region} and the generic {@link Gesture} class for user gestures to
 * implement, as well as the {@link Point2D} class, which may be useful.
 *
 * @namespace westures-core
 */

'use strict';

const Region  = require('./src/Region.js');
const Point2D = require('./src/Point2D.js');
const Gesture = require('./src/Gesture.js');

module.exports = {
  Gesture,
  Point2D,
  Region,
};


},{"./src/Gesture.js":4,"./src/Point2D.js":7,"./src/Region.js":9}],3:[function(require,module,exports){
/*
 * Contains the Binding class.
 */

'use strict';

/**
 * A Binding associates a gesture with an element and a handler function that
 * will be called when the gesture is recognized.
 *
 * @private
 */
class Binding {
  /**
   * Constructor function for the Binding class.
   *
   * @param {Element} element - The element to which to associate the gesture.
   * @param {westures-core.Gesture} gesture - A instance of the Gesture type.
   * @param {Function} handler - The function handler to execute when a gesture
   *    is recognized on the associated element.
   */
  constructor(element, gesture, handler) {
    /**
     * The element to which to associate the gesture.
     *
     * @private
     * @type {Element}
     */
    this.element = element;

    /**
     * The gesture to associate with the given element.
     *
     * @private
     * @type {Gesture}
     */
    this.gesture = gesture;

    /**
     * The function handler to execute when the gesture is recognized on the
     * associated element.
     *
     * @private
     * @type {Function}
     */
    this.handler = handler;
  }

  /**
   * Evalutes the given gesture hook, and dispatches any data that is produced.
   *
   * @private
   *
   * @param {string} hook - which gesture hook to call, must be one of 'start',
   *    'move', or 'end'.
   * @param {State} state - The current State instance.
   */
  evaluateHook(hook, state) {
    const data = this.gesture[hook](state);
    if (data) {
      data.phase = hook;
      data.event = state.event;
      data.type = this.gesture.type;
      data.target = this.element;
      this.handler(data);
    }
  }
}

module.exports = Binding;


},{}],4:[function(require,module,exports){
/*
 * Contains the {@link Gesture} class
 */

'use strict';

let nextGestureNum = 0;

/**
 * The Gesture class that all gestures inherit from.
 *
 * @memberof westures-core
 */
class Gesture {
  /**
   * Constructor function for the Gesture class.
   *
   * @param {string} type - The name of the gesture.
   */
  constructor(type) {
    if (typeof type !== 'string') {
      throw new TypeError('Gestures require a string type');
    }

    /**
     * The name of the gesture. (e.g. 'pan' or 'tap' or 'pinch').
     *
     * @type {string}
     */
    this.type = type;

    /**
     * The unique identifier for each gesture. This allows for distinctions
     * across instances of Gestures that are created on the fly (e.g.
     * gesture-tap-1, gesture-tap-2).
     *
     * @type {string}
     */
    this.id = `gesture-${this.type}-${nextGestureNum++}`;
  }

  /**
   * Event hook for the start phase of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */
  start() {
    return null;
  }

  /**
   * Event hook for the move phase of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */
  move() {
    return null;
  }

  /**
   * Event hook for the end phase of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */
  end() {
    return null;
  }

  /**
   * Event hook for when an input is cancelled.
   *
   * @param {State} state - The input state object of the current region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */
  cancel() {
    return null;
  }
}

module.exports = Gesture;


},{}],5:[function(require,module,exports){
/*
 * Contains the {@link Input} class
 */

'use strict';

const PointerData = require('./PointerData.js');

/**
 * In case event.composedPath() is not available.
 *
 * @private
 *
 * @param {Event} event
 *
 * @return {Element[]} The elements along the composed path of the event.
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

/**
 * A WeakSet is used so that references will be garbage collected when the
 * element they point to is removed from the page.
 *
 * @private
 * @return {WeakSet.<Element>} The Elements in the path of the given event.
 */
function getElementsInPath(event) {
  return new WeakSet(getPropagationPath(event));
}

/**
 * Tracks a single input and contains information about the current, previous,
 * and initial events. Contains the progress of each Input and its associated
 * gestures.
 *
 * @hideconstructor
 */
class Input {
  /**
   * Constructor function for the Input class.
   *
   * @param {(PointerEvent | MouseEvent | TouchEvent)} event - The input event
   *    which will initialize this Input object.
   * @param {number} identifier - The identifier for this input, so that it can
   *    be located in subsequent Event objects.
   */
  constructor(event, identifier) {
    const currentData = new PointerData(event, identifier);

    /**
     * The set of elements along the original event's propagation path at the
     * time it was dispatched.
     *
     * @private
     * @type {WeakSet.<Element>}
     */
    this.initialElements = getElementsInPath(event);

    /**
     * Holds the initial data from the mousedown / touchstart / pointerdown that
     * began this input.
     *
     * @type {PointerData}
     */
    this.initial = currentData;

    /**
     * Holds the most current pointer data for this Input.
     *
     * @type {PointerData}
     */
    this.current = currentData;

    /**
     * Holds the previous pointer data for this Input.
     *
     * @type {PointerData}
     */
    this.previous = currentData;

    /**
     * The identifier for the pointer / touch / mouse button associated with
     * this input.
     *
     * @type {number}
     */
    this.identifier = identifier;

    /**
     * Stores internal state between events for each gesture based off of the
     * gesture's id.
     *
     * @private
     * @type {Object}
     */
    this.progress = {};
  }

  /**
   * The phase of the input: 'start' or 'move' or 'end'
   *
   * @type {string}
   */
  get phase() { return this.current.type; }

  /**
   * The timestamp of the initiating event for this input.
   *
   * @type {number}
   */
  get startTime() { return this.initial.time; }

  /**
   * @param {string} id - The ID of the gesture whose progress is sought.
   *
   * @return {Object} The progress of the gesture.
   */
  getProgressOfGesture(id) {
    if (!this.progress[id]) {
      this.progress[id] = {};
    }
    return this.progress[id];
  }

  /**
   * @return {number} The distance between the initiating event for this input
   *    and its current event.
   */
  totalDistance() {
    return this.initial.distanceTo(this.current);
  }

  /**
   * Saves the given raw event in PointerData form as the current data for this
   * input, pushing the old current data into the previous slot, and tossing
   * out the old previous data.
   *
   * @private
   *
   * @param {Event} event - The event object to wrap with a PointerData.
   */
  update(event) {
    this.previous = this.current;
    this.current = new PointerData(event, this.identifier);
  }

  /**
   * Determines if this PointerData was inside the given element at the time it
   * was dispatched.
   *
   * @private
   *
   * @param {Element} element
   *
   * @return {boolean} true if the Input began inside the element, false
   *    otherwise.
   */
  wasInitiallyInside(element) {
    return this.initialElements.has(element);
  }
}

module.exports = Input;


},{"./PointerData.js":8}],6:[function(require,module,exports){
/*
 * Contains the PHASE object, which translates event names to phases
 * (a.k.a. hooks).
 */

'use strict';

/**
 * Normalizes window events to be either of type start, move, or end.
 *
 * @private
 * @enum {string}
 */
const PHASE = Object.freeze({
  mousedown:   'start',
  touchstart:  'start',
  pointerdown: 'start',

  mousemove:   'move',
  touchmove:   'move',
  pointermove: 'move',

  mouseup:       'end',
  touchend:      'end',
  pointerup:     'end',

  touchcancel:   'cancel',
  pointercancel: 'cancel',
});

module.exports = PHASE;


},{}],7:[function(require,module,exports){
/*
 * Contains the {@link Point2D} class.
 */

'use strict';

/**
 * The Point2D class stores and operates on 2-dimensional points, represented as
 * x and y coordinates.
 *
 * @memberof westures-core
 */
class Point2D {
  /**
   * Constructor function for the Point2D class.
   *
   * @param {number} [ x=0 ] - The x coordinate of the point.
   * @param {number} [ y=0 ] - The y coordinate of the point.
   */
  constructor(x = 0, y = 0) {
    /**
     * The x coordinate of the point.
     *
     * @type {number}
     */
    this.x = x;

    /**
     * The y coordinate of the point.
     *
     * @type {number}
     */
    this.y = y;
  }

  /**
   * Calculates the angle between this point and the given point.
   *
   * @param {!westures-core.Point2D} point - Projected point for calculating the
   * angle.
   *
   * @return {number} Radians along the unit circle where the projected
   * point lies.
   */
  angleTo(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }

  /**
   * Determine the average distance from this point to the provided array of
   * points.
   *
   * @param {!westures-core.Point2D[]} points - the Point2D objects to calculate
   *    the average distance to.
   *
   * @return {number} The average distance from this point to the provided
   *    points.
   */
  averageDistanceTo(points) {
    return this.totalDistanceTo(points) / points.length;
  }

  /**
   * Clone this point.
   *
   * @return {westures-core.Point2D} A new Point2D, identical to this point.
   */
  clone() {
    return new Point2D(this.x, this.y);
  }

  /**
   * Calculates the distance between two points.
   *
   * @param {!westures-core.Point2D} point - Point to which the distance is
   * calculated.
   *
   * @return {number} The distance between the two points, a.k.a. the
   *    hypoteneuse.
   */
  distanceTo(point) {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  /**
   * Subtract the given point from this point.
   *
   * @param {!westures-core.Point2D} point - Point to subtract from this point.
   *
   * @return {westures-core.Point2D} A new Point2D, which is the result of (this
   * - point).
   */
  minus(point) {
    return new Point2D(
      this.x - point.x,
      this.y - point.y
    );
  }

  /**
   * Return the summation of this point to the given point.
   *
   * @param {!westures-core.Point2D} point - Point to add to this point.
   *
   * @return {westures-core.Point2D} A new Point2D, which is the addition of the
   * two points.
   */
  plus(point) {
    return new Point2D(
      this.x + point.x,
      this.y + point.y,
    );
  }

  /**
   * Calculates the total distance from this point to an array of points.
   *
   * @param {!westures-core.Point2D[]} points - The array of Point2D objects to
   *    calculate the total distance to.
   *
   * @return {number} The total distance from this point to the provided points.
   */
  totalDistanceTo(points) {
    return points.reduce((d, p) => d + this.distanceTo(p), 0);
  }

  /**
   * Calculates the midpoint of a list of points.
   *
   * @param {westures-core.Point2D[]} points - The array of Point2D objects for
   *    which to calculate the midpoint
   *
   * @return {westures-core.Point2D} The midpoint of the provided points.
   */
  static midpoint(points = []) {
    if (points.length === 0) return null;

    const total = Point2D.sum(points);
    return new Point2D(
      total.x / points.length,
      total.y / points.length,
    );
  }

  /**
   * Calculates the sum of the given points.
   *
   * @param {westures-core.Point2D[]} points - The Point2D objects to sum up.
   *
   * @return {westures-core.Point2D} A new Point2D representing the sum of the
   * given points.
   */
  static sum(points = []) {
    return points.reduce((total, pt) => total.plus(pt), new Point2D(0, 0));
  }
}

module.exports = Point2D;


},{}],8:[function(require,module,exports){
/*
 * Contains the {@link PointerData} class
 */

'use strict';

const Point2D = require('./Point2D.js');
const PHASE   = require('./PHASE.js');

/**
 * @private
 * @return {Event} The Event object which corresponds to the given identifier.
 *    Contains clientX, clientY values.
 */
function getEventObject(event, identifier) {
  if (event.changedTouches) {
    return Array.from(event.changedTouches).find(t => {
      return t.identifier === identifier;
    });
  }
  return event;
}

/**
 * Low-level storage of pointer data based on incoming data from an interaction
 * event.
 *
 * @hideconstructor
 */
class PointerData {
  /**
   * @constructor
   *
   * @param {Event} event - The event object being wrapped.
   * @param {number} identifier - The index of touch if applicable
   */
  constructor(event, identifier) {
    /**
     * The original event object.
     *
     * @type {Event}
     */
    this.originalEvent = event;

    /**
     * The type or 'phase' of this batch of pointer data. 'start' or 'move' or
     * 'end'.
     *
     * @type {string}
     */
    this.type = PHASE[event.type];

    /**
     * The timestamp of the event in milliseconds elapsed since January 1, 1970,
     * 00:00:00 UTC.
     *
     * @type {number}
     */
    this.time = Date.now();

    const eventObj = getEventObject(event, identifier);
    /**
     * The (x,y) coordinate of the event, wrapped in a Point2D.
     *
     * @type {westures-core.Point2D}
     */
    this.point = new Point2D(eventObj.clientX, eventObj.clientY);
  }

  /**
   * Calculates the angle between this event and the given event.
   *
   * @param {PointerData} pdata
   *
   * @return {number} Radians measurement between this event and the given
   *    event's points.
   */
  angleTo(pdata) {
    return this.point.angleTo(pdata.point);
  }

  /**
   * Calculates the distance between two PointerDatas.
   *
   * @param {PointerData} pdata
   *
   * @return {number} The distance between the two points, a.k.a. the
   *    hypoteneuse.
   */
  distanceTo(pdata) {
    return this.point.distanceTo(pdata.point);
  }
}

module.exports = PointerData;


},{"./PHASE.js":6,"./Point2D.js":7}],9:[function(require,module,exports){
/*
 * Contains the {@link Region} class
 */

'use strict';

const Binding = require('./Binding.js');
const State   = require('./State.js');
const PHASE   = require('./PHASE.js');

const POINTER_EVENTS = [
  'pointerdown',
  'pointermove',
  'pointerup',
];

const MOUSE_EVENTS = [
  'mousedown',
  'mousemove',
  'mouseup',
];

const TOUCH_EVENTS = [
  'touchstart',
  'touchmove',
  'touchend',
];

const CANCEL_EVENTS = [
  'pointercancel',
  'touchcancel',
];

/**
 * Allows the user to specify the control region which will listen for user
 * input events.
 *
 * @memberof westures-core
 */
class Region {
  /**
   * Constructor function for the Region class.
   *
   * @param {Element} element - The element which should listen to input events.
   * @param {boolean} capture - Whether the region uses the capture phase of
   *    input events. If false, uses the bubbling phase.
   * @param {boolean} preventDefault - Whether the default browser functionality
   *    should be disabled. This option should most likely be ignored. Here
   *    there by dragons if set to false.
   */
  constructor(element, capture = false, preventDefault = true) {
    /**
     * The list of relations between elements, their gestures, and the handlers.
     *
     * @private
     * @type {Binding[]}
     */
    this.bindings = [];

    /**
     * The list of active bindings for the current input session.
     *
     * @private
     * @type {Binding[]}
     */
    this.activeBindings = [];

    /**
     * Whether an input session is currently active.
     *
     * @private
     * @type {boolean}
     */
    this.isWaiting = true;

    /**
     * The element being bound to.
     *
     * @private
     * @type {Element}
     */
    this.element = element;

    /**
     * Whether the region listens for captures or bubbles.
     *
     * @private
     * @type {boolean}
     */
    this.capture = capture;

    /**
     * Whether the default browser functionality should be disabled. This option
     * should most likely be ignored. Here there by dragons if set to false.
     *
     * @private
     * @type {boolean}
     */
    this.preventDefault = preventDefault;

    /**
     * The internal state object for a Region.  Keeps track of inputs.
     *
     * @private
     * @type {State}
     */
    this.state = new State();

    // Begin operating immediately.
    this.activate();
  }

  /**
   * Activates the region by adding event listeners for all appropriate input
   * events to the region's element.
   *
   * @private
   */
  activate() {
    /*
     * Having to listen to both mouse and touch events is annoying, but
     * necessary due to conflicting standards and browser implementations.
     * Pointer is a fallback for now instead of the primary, until I figure out
     * all the details to do with pointer-events and touch-action and their
     * cross browser compatibility.
     *
     * Listening to both mouse and touch comes with the difficulty that
     * preventDefault() must be called to prevent both events from iterating
     * through the system. However I have left it as an option to the end user,
     * which defaults to calling preventDefault(), in case there's a use-case I
     * haven't considered or am not aware of.
     *
     * It is also a good idea to keep regions small in large pages.
     *
     * See:
     *  https://www.html5rocks.com/en/mobile/touchandmouse/
     *  https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
     *  https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
     */
    let eventNames = [];
    if (window.TouchEvent || window.MouseEvent) {
      eventNames = MOUSE_EVENTS.concat(TOUCH_EVENTS);
    } else {
      eventNames = POINTER_EVENTS;
    }

    // Bind detected browser events to the region element.
    const arbiter = this.arbitrate.bind(this);
    eventNames.forEach(eventName => {
      this.element.addEventListener(eventName, arbiter, {
        capture: this.capture,
        once:    false,
        passive: false,
      });
    });

    ['blur'].concat(CANCEL_EVENTS).forEach(eventname => {
      window.addEventListener(eventname, (e) => {
        e.preventDefault();
        this.state = new State();
        this.resetActiveBindings();
      });
    });
  }

  /**
   * Resets the active bindings.
   *
   * @private
   */
  resetActiveBindings() {
    this.activeBindings = [];
    this.isWaiting = true;
  }

  /**
   * Selects the bindings that are active for the current input sequence.
   *
   * @private
   */
  updateActiveBindings() {
    if (this.isWaiting && this.state.inputs.length > 0) {
      const input = this.state.inputs[0];
      this.activeBindings = this.bindings.filter(b => {
        return input.wasInitiallyInside(b.element);
      });
      this.isWaiting = false;
    }
  }

  /**
   * Evaluates whether the current input session has completed.
   *
   * @private
   */
  pruneActiveBindings() {
    if (this.state.hasNoActiveInputs()) {
      this.resetActiveBindings();
    }
  }

  /**
   * All input events flow through this function. It makes sure that the input
   * state is maintained, determines which bindings to analyze based on the
   * initial position of the inputs, calls the relevant gesture hooks, and
   * dispatches gesture data.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   */
  arbitrate(event) {
    this.state.updateAllInputs(event);
    this.updateActiveBindings();

    if (this.activeBindings.length > 0) {
      if (this.preventDefault) event.preventDefault();

      this.activeBindings.forEach(binding => {
        binding.evaluateHook(PHASE[event.type], this.state);
      });
    }

    this.state.clearEndedInputs();
    this.pruneActiveBindings();
  }

  /**
   * Bind an element to a gesture with an associated handler.
   *
   * @param {Element} element - The element object.
   * @param {westures-core.Gesture} gesture - Gesture type with which to bind.
   * @param {Function} handler - The function to execute when a gesture is
   *    recognized.
   */
  addGesture(element, gesture, handler) {
    this.bindings.push(new Binding(element, gesture, handler));
  }

  /**
   * Retrieves Bindings by their associated element.
   *
   * @private
   *
   * @param {Element} element - The element for which to find bindings.
   *
   * @return {Binding[]} Bindings to which the element is bound.
   */
  getBindingsByElement(element) {
    return this.bindings.filter(b => b.element === element);
  }

  /**
   * Unbinds an element from either the specified gesture or all if no gesture
   * is specified.
   *
   * @param {Element} element - The element to unbind.
   * @param {westures-core.Gesture} [ gesture ] - The gesture to unbind. If
   * undefined, will unbind all Bindings associated with the given element.
   */
  removeGestures(element, gesture) {
    this.getBindingsByElement(element).forEach(b => {
      if (gesture == null || b.gesture === gesture) {
        this.bindings.splice(this.bindings.indexOf(b), 1);
      }
    });
  }
}

module.exports = Region;


},{"./Binding.js":3,"./PHASE.js":6,"./State.js":10}],10:[function(require,module,exports){
/*
 * Contains the {@link State} class
 */

'use strict';

const Input   = require('./Input.js');
const PHASE   = require('./PHASE.js');
const Point2D = require('./Point2D.js');

const symbols = Object.freeze({
  inputs: Symbol.for('inputs'),
});

/*
 * Set of helper functions for updating inputs based on type of input.
 * Must be called with a bound 'this', via bind(), or call(), or apply().
 *
 * @private
 */
const update_fns = {
  TouchEvent: function TouchEvent(event) {
    Array.from(event.changedTouches).forEach(touch => {
      this.updateInput(event, touch.identifier);
    });
  },

  PointerEvent: function PointerEvent(event) {
    this.updateInput(event, event.pointerId);
  },

  MouseEvent: function MouseEvent(event) {
    if (event.button === 0) {
      this.updateInput(event, event.button);
    }
  },
};

/**
 * Keeps track of currently active and ending input points on the interactive
 * surface.
 *
 * @hideconstructor
 */
class State {
  /**
   * Constructor for the State class.
   */
  constructor() {
    /**
     * Keeps track of the current Input objects.
     *
     * @private
     * @type {Map}
     */
    this[symbols.inputs] = new Map();

    /**
     * All currently valid inputs, including those that have ended.
     *
     * @type {Input[]}
     */
    this.inputs = [];

    /**
     * The array of currently active inputs, sourced from the current Input
     * objects. "Active" is defined as not being in the 'end' phase.
     *
     * @type {Input[]}
     */
    this.active = [];

    /**
     * The array of latest point data for the currently active inputs, sourced
     * from this.active.
     *
     * @type {westures-core.Point2D[]}
     */
    this.activePoints = [];

    /**
     * The centroid of the currently active points.
     *
     * @type {westures-core.Point2D}
     */
    this.centroid = {};

    /**
     * The latest event that the state processed.
     *
     * @type {Event}
     */
    this.event = null;
  }

  /**
   * Deletes all inputs that are in the 'end' phase.
   *
   * @private
   */
  clearEndedInputs() {
    this[symbols.inputs].forEach((v, k) => {
      if (v.phase === 'end') this[symbols.inputs].delete(k);
    });
  }

  /**
   * @param {string} phase - One of 'start', 'move', or 'end'.
   *
   * @return {Input[]} Inputs in the given phase.
   */
  getInputsInPhase(phase) {
    return this.inputs.filter(i => i.phase === phase);
  }

  /**
   * @param {string} phase - One of 'start', 'move', or 'end'.
   *
   * @return {Input[]} Inputs <b>not</b> in the given phase.
   */
  getInputsNotInPhase(phase) {
    return this.inputs.filter(i => i.phase !== phase);
  }

  /**
   * @private
   * @return {boolean} True if there are no active inputs. False otherwise.
   */
  hasNoActiveInputs() {
    return this[symbols.inputs].size === 0;
  }

  /**
   * Update the input with the given identifier using the given event.
   *
   * @private
   *
   * @param {Event} event - The event being captured.
   * @param {number} identifier - The identifier of the input to update.
   */
  updateInput(event, identifier) {
    if (PHASE[event.type] === 'start') {
      this[symbols.inputs].set(identifier, new Input(event, identifier));
    } else if (this[symbols.inputs].has(identifier)) {
      this[symbols.inputs].get(identifier).update(event);
    }
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   *
   * @private
   * @param {Event} event - The event being captured.
   */
  updateAllInputs(event) {
    update_fns[event.constructor.name].call(this, event);
    this.updateFields(event);
  }

  /**
   * Updates the convenience fields.
   *
   * @private
   * @param {Event} event - Event with which to update the convenience fields.
   */
  updateFields(event = null) {
    this.inputs = Array.from(this[symbols.inputs].values());
    this.active = this.getInputsNotInPhase('end');
    this.activePoints = this.active.map(i => i.current.point);
    this.centroid = Point2D.midpoint(this.activePoints);
    if (event) this.event = event;
  }
}

module.exports = State;


},{"./Input.js":5,"./PHASE.js":6,"./Point2D.js":7}],11:[function(require,module,exports){
/*
 * Contains the Pan class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;

/**
 * Data returned when a Pan is recognized.
 *
 * @typedef {Object} PanData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D} change - The change vector from the last emit.
 * @property {westures.Point2D} point - The centroid of the currently active
 *    points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pan is defined as a normal movement in any direction.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PanData
 * @memberof westures
 */
class Pan extends Gesture {
  /**
   * @param {Object} [options]
   * @param {string} [options.muteKey=undefined] - If this key is pressed, this
   *    gesture will be muted (i.e. not recognized). One of 'altKey', 'ctrlKey',
   *    'shiftKey', or 'metaKey'.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * Don't emit any data if this key is pressed.
     *
     * @private
     * @type {string}
     */
    this.muteKey = options.muteKey;

    /**
     * The previous point location.
     *
     * @private
     * @type {module:westures.Point2D}
     */
    this.previous = null;

    /**
     * Stage the emitted data once.
     *
     * @private
     * @type {ReturnTypes.RotateData}
     */
    this.stagedEmit = null;
  }

  /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @private
   * @param {State} state - The state object received by a hook.
   */
  restart(state) {
    if (state.active.length >= REQUIRED_INPUTS) {
      this.previous = state.centroid;
    }
    this.stagedEmit = null;
  }

  /**
   * Event hook for the start of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Pan.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PanData} <tt>null</tt> if the gesture was muted or
   * otherwise not recognized.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) {
      return null;
    }

    if (this.muteKey && state.event[this.muteKey]) {
      this.restart(state);
      return null;
    }

    const point = state.centroid;
    const change = point.minus(this.previous);

    this.previous = point;
    return { change, point };
  }

  /**
   * Event hook for the end of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Pan. Resets the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.restart(state);
  }
}

module.exports = Pan;


},{"westures-core":2}],12:[function(require,module,exports){
/*
 * Contains the abstract Pinch class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Pinch is recognized.
 *
 * @typedef {Object} PinchData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 *    the centroid.
 * @property {number} change - The change in distance since last emit.
 * @property {westures.Point2D} midpoint - The centroid of the currently active
 *    points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.PinchData
 * @memberof westures
 */
class Pinch extends Gesture {
  /**
   * @param {Object} [options]
   * @param {number} [options.minInputs=2] The minimum number of inputs that
   * must be active for a Pinch to be recognized.
   * @param {boolean} [options.smoothing=true] Whether to apply smoothing to
   * emitted data.
   */
  constructor(options = {}) {
    super('pinch');
    const settings = { ...Pinch.DEFAULTS, ...options };

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * The function through which emits are passed.
     *
     * @private
     * @type {function}
     */
    this.emit = null;
    if (settings.smoothing) {
      this.emit = this.smooth.bind(this);
    } else {
      this.emit = data => data;
    }

    /**
     * The previous distance.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

    /**
     * Stage the emitted data once.
     *
     * @private
     * @type {ReturnTypes.RotateData}
     */
    this.stagedEmit = null;
  }

  /**
   * Initializes the gesture progress and stores it in the first input for
   * reference events.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    if (state.active.length >= this.minInputs) {
      const distance = state.centroid.averageDistanceTo(state.activePoints);
      this.previous = distance;
    }
    this.stagedEmit = null;
  }

  /**
   * Event hook for the start of a Pinch.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Pinch.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.PinchData} <tt>null</tt> if not recognized.
   */
  move(state) {
    if (state.active.length < this.minInputs) return null;

    const midpoint = state.centroid;
    const distance = midpoint.averageDistanceTo(state.activePoints);
    const change = distance / this.previous;

    this.previous = distance;
    return this.emit({ distance, midpoint, change });
  }

  /**
   * Event hook for the end of a Pinch.
   *
   * @private
   * @param {State} input status object
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a Pinch.
   *
   * @private
   * @param {State} input status object
   */
  cancel(state) {
    this.restart(state);
  }

  /**
   * Smooth out the outgoing data.
   *
   * @private
   * @param {ReturnTypes.PinchData} next
   *
   * @return {?ReturnTypes.PinchData}
   */
  smooth(next) {
    let result = null;

    if (this.stagedEmit) {
      const odiff = this.stagedEmit.change - 1;
      const ndiff = next.change - 1;
      if (Math.sign(odiff) === Math.sign(ndiff)) {
        result = this.stagedEmit;
      } else {
        next.change += odiff;
      }
    }

    this.stagedEmit = next;
    return result;
  }
}

Pinch.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Pinch;


},{"westures-core":2}],13:[function(require,module,exports){
/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Rotate is recognized.
 *
 * @typedef {Object} RotateData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} delta - In radians, the change in angle since last emit.
 * @property {westures.Point2D} pivot - The centroid of the currently active
 *    points.
 *
 * @memberof ReturnTypes
 */

const PI2 = 2 * Math.PI;

/**
 * Helper function to regulate angular differences, so they don't jump from 0 to
 * 2*PI or vice versa.
 *
 * @private
 * @param {number} a - Angle in radians.
 * @param {number} b - Angle in radians.
 * @return {number} c, given by: c = a - b such that || < PI
 */
function angularMinus(a, b = 0) {
  let diff = a - b;
  if (diff < -Math.PI) {
    diff += PI2;
  } else if (diff > Math.PI) {
    diff -= PI2;
  }
  return diff;
}

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.RotateData
 * @memberof westures
 */
class Rotate extends Gesture {
  /**
   * @param {Object} [options]
   * @param {number} [options.minInputs=2] The minimum number of inputs that
   * must be active for a Rotate to be recognized.
   * @param {boolean} [options.smoothing=true] Whether to apply smoothing to
   * emitted data.
   */
  constructor(options = {}) {
    super('rotate');
    const settings = { ...Rotate.DEFAULTS, ...options };

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @private
     * @type {number}
     */
    this.minInputs = settings.minInputs;

    /**
     * The function through which emits are passed.
     *
     * @private
     * @type {function}
     */
    this.emit = null;
    if (settings.smoothing) {
      this.emit = this.smooth.bind(this);
    } else {
      this.emit = data => data;
    }

    /**
     * Track the previously emitted rotation angle.
     *
     * @private
     * @type {number[]}
     */
    this.previousAngles = [];

    /**
     * Stage the emitted data once.
     *
     * @private
     * @type {ReturnTypes.RotateData}
     */
    this.stagedEmit = null;
  }

  /**
   * Store individual angle progress on each input, return average angle change.
   *
   * @private
   * @param {State} state - current input state.
   */
  getAngle(state) {
    if (state.active.length < this.minInputs) return null;

    let angle = 0;
    const stagedAngles = [];

    state.active.forEach((input, idx) => {
      const currentAngle = state.centroid.angleTo(input.current.point);
      angle += angularMinus(currentAngle, this.previousAngles[idx]);
      stagedAngles[idx] = currentAngle;
    });

    angle /= (state.active.length);
    this.previousAngles = stagedAngles;
    return angle;
  }

  /**
   * Restart the gesture;
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    this.previousAngles = [];
    this.stagedEmit = null;
    this.getAngle(state);
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.restart(state);
  }

  /**
   * Event hook for the move of a Rotate gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.RotateData} <tt>null</tt> if this event did not occur
   */
  move(state) {
    const delta = this.getAngle(state);
    if (delta) {
      return this.emit({ pivot: state.centroid, delta });
    }
    return null;
  }

  /**
   * Event hook for the end of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.restart(state);
  }

  /**
   * Event hook for the cancel of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.restart(state);
  }

  /**
   * Smooth out the outgoing data.
   *
   * @private
   * @param {ReturnTypes.RotateData} next
   *
   * @return {?ReturnTypes.RotateData}
   */
  smooth(next) {
    let result = null;

    if (this.stagedEmit) {
      if (Math.sign(this.stagedEmit.delta) === Math.sign(next.delta)) {
        result = this.stagedEmit;
      } else {
        next.delta += this.stagedEmit.delta;
      }
    }

    this.stagedEmit = next;
    return result;
  }
}

Rotate.DEFAULTS = Object.freeze({
  minInputs: 2,
  smoothing: true,
});

module.exports = Rotate;


},{"westures-core":2}],14:[function(require,module,exports){
/*
 * Contains the Swipe class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const PROGRESS_STACK_SIZE = 7;
const MS_THRESHOLD = 300;

/**
 * Data returned when a Swipe is recognized.
 *
 * @typedef {Object} SwipeData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} velocity - The velocity of the swipe.
 * @property {number} direction - In radians, the direction of the swipe.
 * @property {westures.Point2D} point - The point at which the swipe ended.
 * @property {number} time - The epoch time, in ms, when the swipe ended.
 *
 * @memberof ReturnTypes
 */

/**
 * Calculates the angle of movement along a series of moves.
 *
 * @private
 * @inner
 * @memberof module:westures.Swipe
 * @see {@link https://en.wikipedia.org/wiki/Mean_of_circular_quantities}
 *
 * @param {{time: number, point: module:westures-core.Point2D}} moves - The
 * moves list to process.
 * @param {number} vlim - The number of moves to process.
 *
 * @return {number} The angle of the movement.
 */
function calc_angle(moves, vlim) {
  const point = moves[vlim].point;
  let sin = 0;
  let cos = 0;
  for (let i = 0; i < vlim; ++i) {
    const angle = moves[i].point.angleTo(point);
    sin += Math.sin(angle);
    cos += Math.cos(angle);
  }
  sin /= vlim;
  cos /= vlim;
  return Math.atan2(sin, cos);
}

/**
 * Local helper function for calculating the velocity between two timestamped
 * points.
 *
 * @private
 * @inner
 * @memberof module:westures.Swipe
 *
 * @param {object} start
 * @param {westures.Point2D} start.point
 * @param {number} start.time
 * @param {object} end
 * @param {westures.Point2D} end.point
 * @param {number} end.time
 *
 * @return {number} velocity from start to end point.
 */
function velocity(start, end) {
  const distance = end.point.distanceTo(start.point);
  const time = end.time - start.time + 1;
  return distance / time;
}

/**
 * Calculates the veloctiy of movement through a series of moves.
 *
 * @private
 * @inner
 * @memberof module:westures.Swipe
 *
 * @param {{time: number, point: module:westures-core.Point2D}} moves - The
 * moves list to process.
 * @param {number} vlim - The number of moves to process.
 *
 * @return {number} The velocity of the moves.
 */
function calc_velocity(moves, vlim) {
  let max = 0;
  for (let i = 0; i < vlim; ++i) {
    const current = velocity(moves[i], moves[i + 1]);
    if (current > max) max = current;
  }
  return max;
}

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.SwipeData
 * @memberof westures
 */
class Swipe extends Gesture {
  /**
   * Constructor function for the Swipe class.
   */
  constructor() {
    super('swipe');

    /**
     * Moves list.
     *
     * @private
     * @type {object[]}
     */
    this.moves = [];

    /**
     * Data to emit when all points have ended.
     *
     * @private
     * @type {ReturnTypes.SwipeData}
     */
    this.saved = null;
  }

  /**
   * Refresh the swipe state.
   *
   * @private
   */
  refresh() {
    this.moves = [];
    this.saved = null;
  }

  /**
   * Event hook for the start of a gesture. Resets the swipe state.
   *
   * @private
   * @param {State} state - current input state.
   */
  start() {
    this.refresh();
  }

  /**
   * Event hook for the move of a gesture. Captures an input's x/y coordinates
   * and the time of it's event on a stack.
   *
   * @private
   * @param {State} state - current input state.
   */
  move(state) {
    if (state.active.length >= REQUIRED_INPUTS) {
      this.moves.push({
        time:  Date.now(),
        point: state.centroid,
      });

      if (this.moves.length > PROGRESS_STACK_SIZE) {
        this.moves.splice(0, this.moves.length - PROGRESS_STACK_SIZE);
      }
    }
  }

  /**
   * Determines if the input's history validates a swipe motion.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.SwipeData} <tt>null</tt> if the gesture is not
   * recognized.
   */
  end(state) {
    const result = this.getResult();
    this.moves = [];

    if (state.active.length > 0) {
      this.saved = result;
      return null;
    }

    this.saved = null;
    return this.validate(result);
  }

  /**
   * Event hook for the cancel phase of a Swipe.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel() {
    this.refresh();
  }

  /**
   * Get the swipe result.
   *
   * @private
   */
  getResult() {
    if (this.moves.length < PROGRESS_STACK_SIZE) {
      return this.saved;
    }
    const vlim = PROGRESS_STACK_SIZE - 1;
    const { point, time } = this.moves[vlim];
    const velocity = calc_velocity(this.moves, vlim);
    const direction = calc_angle(this.moves, vlim);
    return { point, velocity, direction, time };
  }

  /**
   * Validates that an emit should occur with the given data.
   *
   * @private
   * @param {?ReturnTypes.SwipeData} data
   */
  validate(data) {
    if (data == null) return null;
    return (Date.now() - data.time > MS_THRESHOLD) ? null : data;
  }
}

module.exports = Swipe;


},{"westures-core":2}],15:[function(require,module,exports){
/*
 * Contains the Rotate class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const REQUIRED_INPUTS = 1;
const defaults = Object.freeze({
  deadzoneRadius: 15,
});

/**
 * Data returned when a Swivel is recognized.
 *
 * @typedef {Object} SwivelData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} delta - In radians, the change in angle since last emit.
 * @property {westures.Point2D} pivot - The pivot point.
 * @property {westures.Point2D} point - The current location of the input point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.SwivelData
 * @memberof westures
 */
class Swivel extends Gesture {
  /**
   * Constructor for the Swivel class.
   *
   * @param {Object} [options]
   * @param {number} [options.deadzoneRadius=10] - The radius in pixels around
   *    the start point in which to do nothing.
   * @param {string} [options.enableKey=undefined] - One of 'altKey', 'ctrlKey',
   *    'metaKey', or 'shiftKey'. If set, gesture will only be recognized while
   *    this key is down.
   * @param {Element} [options.pivotCenter] - If set, the swivel's pivot point
   *    will be set to the center of the given pivotCenter element. Otherwise,
   *    the pivot will be the location of the first contact point.
   */
  constructor(options = {}) {
    super('swivel');

    /**
     * The radius around the start point in which to do nothing.
     *
     * @private
     * @type {number}
     */
    this.deadzoneRadius = options.deadzoneRadius || defaults.deadzoneRadius;

    /**
     * If this is set, gesture will only respond to events where this property
     * is truthy. Should be one of 'ctrlKey', 'altKey', or 'shiftKey'.
     *
     * @private
     * @type {string}
     */
    this.enableKey = options.enableKey;

    /**
     * If this is set, the swivel will use the center of the element as its
     * pivot point. Unreliable if the element is moved during a swivel gesture.
     *
     * @private
     * @type {Element}
     */
    this.pivotCenter = options.pivotCenter;

    /**
     * The pivot point of the swivel.
     *
     * @private
     * @type {module:westures.Point2D}
     */
    this.pivot = null;

    /**
     * The previous angle.
     *
     * @private
     * @type {number}
     */
    this.previous = 0;

    /**
     * Whether the swivel is active.
     *
     * @private
     * @type {boolean}
     */
    this.isActive = false;
  }

  /**
   * Returns whether this gesture is currently enabled.
   *
   * @private
   * @param {Event} event - The state's current input event.
   * @return {boolean} true if the gesture is enabled, false otherwise.
   */
  enabled(event) {
    return !this.enableKey || event[this.enableKey];
  }

  /**
   * Restart the given progress object using the given input object.
   *
   * @private
   * @param {State} state - current input state.
   */
  restart(state) {
    this.isActive = true;
    if (this.pivotCenter) {
      const rect = this.pivotCenter.getBoundingClientRect();
      this.pivot = new Point2D(
        rect.left + (rect.width / 2),
        rect.top + (rect.height / 2)
      );
      this.previous = this.pivot.angleTo(state.centroid);
    } else {
      this.pivot = state.centroid;
      this.previous = 0;
    }
  }

  /**
   * Refresh the gesture.
   *
   * @private
   * @param {module:westures.Input[]} inputs - Input list to process.
   * @param {State} state - current input state.
   */
  refresh(inputs, state) {
    if (inputs.length === REQUIRED_INPUTS && this.enabled(state.event)) {
      this.restart(state);
    }
  }

  /**
   * Event hook for the start of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   */
  start(state) {
    this.refresh(state.getInputsInPhase('start'), state);
  }

  /**
   * Determine the data to emit. To be called once valid state for a swivel has
   * been assured, except for deadzone.
   *
   * @private
   * @param {State} state - current input state.
   * @return {?Returns.SwivelData} Data to emit.
   */
  calculateOutput(state) {
    const point = state.centroid;
    const pivot = this.pivot;
    const angle = pivot.angleTo(point);
    const delta = angle - this.previous;

    /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */
    this.previous = angle;

    if (pivot.distanceTo(point) > this.deadzoneRadius) {
      return { delta, pivot, point };
    }
    return null;
  }

  /**
   * Event hook for the move of a Swivel gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.SwivelData} <tt>null</tt> if the gesture is not
   * recognized.
   */
  move(state) {
    if (state.active.length !== REQUIRED_INPUTS) return null;

    let output = null;
    if (this.enabled(state.event)) {
      if (this.isActive) {
        output = this.calculateOutput(state);
      } else {
        // The enableKey was just pressed again.
        this.refresh(state.active, state);
      }
    } else {
      // The enableKey was released, therefore pivot point is now invalid.
      this.isActive = false;
    }

    return output;
  }

  /**
   * Event hook for the end of a Swivel.
   *
   * @private
   * @param {State} state - current input state.
   */
  end(state) {
    this.refresh(state.active, state);
  }

  /**
   * Event hook for the cancel of a Swivel.
   *
   * @private
   * @param {State} state - current input state.
   */
  cancel(state) {
    this.end(state);
  }
}

module.exports = Swivel;


},{"westures-core":2}],16:[function(require,module,exports){
/*
 * Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const defaults = Object.freeze({
  MIN_DELAY_MS:      0,
  MAX_DELAY_MS:      300,
  NUM_INPUTS:        1,
  MOVE_PX_TOLERANCE: 10,
});

/**
 * Data returned when a Tap is recognized.
 *
 * @typedef {Object} TapData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} x - x coordinate of tap point.
 * @property {number} y - y coordinate of tap point.
 *
 * @memberof ReturnTypes
 */

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.TapData
 * @memberof westures
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   *
   * @param {Object} [options] - The options object.
   * @param {number} [options.minDelay=0] - The minimum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {number} [options.maxDelay=300] - The maximum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
   *    move.
   */
  constructor(options = {}) {
    super('tap');

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds. The minimum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @private
     * @type {number}
     */
    this.minDelay = options.minDelay || defaults.MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @private
     * @type {number}
     */
    this.maxDelay = options.maxDelay || defaults.MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @private
     * @type {number}
     */
    this.numInputs = options.numInputs || defaults.NUM_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @private
     * @type {number}
     */
    this.tolerance = options.tolerance || defaults.MOVE_PX_TOLERANCE;

    /**
     * An array of inputs that have ended recently.
     *
     * @private
     * @type {Input[]}
     */
    this.ended = [];
  }

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TapData} <tt>null</tt> if the gesture is not to be
   * emitted, Object with information otherwise.
   */
  end(state) {
    const now = Date.now();

    this.ended = this.ended.concat(state.getInputsInPhase('end'))
      .filter(input => {
        const tdiff = now - input.startTime;
        return tdiff <= this.maxDelay && tdiff >= this.minDelay;
      });

    if (this.ended.length !== this.numInputs ||
        this.ended.some(i => i.totalDistance() > this.tolerance)) {
      return null;
    }

    const result = Point2D.midpoint(this.ended.map(i => i.current.point));
    this.ended = [];
    return result;
  }
}

module.exports = Tap;


},{"westures-core":2}],17:[function(require,module,exports){
/*
 * Contains the Track class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * Data returned when a Track is recognized.
 *
 * @typedef {Object} TrackData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures.Point2D[]} active - Points currently in 'start' or 'move'
 *    phase.
 * @property {westures.Point2D} centroid - centroid of currently active points.
 *
 * @memberof ReturnTypes
 */

/**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 *
 * @extends westures.Gesture
 * @see ReturnTypes.TrackData
 * @memberof westures
 */
class Track extends Gesture {
  /**
   * Constructor for the Track class.
   *
   * @param {string[]} [phases=[]] Phases to recognize. Entries can be any or
   *    all of 'start', 'move', 'end', and 'cancel'.
   */
  constructor(phases = []) {
    super('track');
    this.trackStart  = phases.includes('start');
    this.trackMove   = phases.includes('move');
    this.trackEnd    = phases.includes('end');
    this.trackCancel = phases.includes('cancel');
  }

  /**
   * @private
   * @param {State} state - current input state.
   * @return {ReturnTypes.TrackData}
   */
  data({ activePoints, centroid }) {
    return { active: activePoints, centroid };
  }

  /**
   * Event hook for the start of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  start(state) {
    return this.trackStart ? this.data(state) : null;
  }

  /**
   * Event hook for the move of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  move(state) {
    return this.trackMove ? this.data(state) : null;
  }

  /**
   * Event hook for the end of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  end(state) {
    return this.trackEnd ? this.data(state) : null;
  }

  /**
   * Event hook for the cancel of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?ReturnTypes.TrackData} <tt>null</tt> if not recognized.
   */
  cancel(state) {
    return this.trackCancel ? this.data(state) : null;
  }
}

module.exports = Track;


},{"westures-core":2}]},{},[1])(1)
});
