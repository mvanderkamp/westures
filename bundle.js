(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.westures = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Main module containing API methods and Gesture constructors.
 */

'use strict';

const Core    = require('westures-core');
const Pan     = require('./src/Pan.js');
const Pinch   = require('./src/Pinch.js');
const Rotate  = require('./src/Rotate.js');
const Swipe   = require('./src/Swipe.js');
const Swivel  = require('./src/Swivel.js');
const Tap     = require('./src/Tap.js');
const Track   = require('./src/Track.js');

/**
 * The global API interface for Westures. Contains the {@link 
 * https://mvanderkamp.github.io/westures-core/Region.html Region} class, a
 * {@link https://mvanderkamp.github.io/westures-core/Point2D.html Point2D}
 * class, the {@link https://mvanderkamp.github.io/westures-core/Gesture.html
 * Gesture} interface, and the following predefined gestures: {@link Pan},
 * {@link Pinch}, {@link Rotate}, {@link Swipe}, {@link Swivel}, {@link Tap},
 * {@link Track}.
 *
 * @module westures
 */
module.exports = {
  ...Core,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Swivel,
  Tap,
  Track,
};


},{"./src/Pan.js":11,"./src/Pinch.js":12,"./src/Rotate.js":13,"./src/Swipe.js":14,"./src/Swivel.js":15,"./src/Tap.js":16,"./src/Track.js":17,"westures-core":2}],2:[function(require,module,exports){
/**
 * @file The global API interface for Westures. Exposes a constructor for the
 * {@link Region} and the generic {@link Gesture} class for user gestures to
 * implement, as well as the {@link Point2D} class, which may be useful.
 *
 * @module westures-core
 * @type {Object}
 * @property {Class} Region - The "entry point" class for Westures. Gets the
 *    ball rolling, so to speak, when it is instantiated.
 * @property {Class} Gesture - This class is the one all Gestures using this
 *    library should extend.
 * @property {Class} Point2D - This class is available for convenience. It
 *    defines some basic operations on a point in a two dimensional space.
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
/**
 * @file Contains the {@link Binding} class.
 */

'use strict';

/**
 * A Binding associates a gesture with an element and a handler function that
 * will be called when the gesture is recognized.
 */
class Binding {
  /**
   * Constructor function for the Binding class.
   *
   * @param {Element} element - The element to which to associate the gesture.
   * @param {Gesture} gesture - A instance of the Gesture type.
   * @param {Function} handler - The function handler to execute when a gesture
   *    is recognized on the associated element.
   */
  constructor(element, gesture, handler) {
    /**
     * The element to which to associate the gesture.
     *
     * @member {Element}
     */
    this.element = element;

    /**
     * The gesture to associate with the given element.
     *
     * @member {Gesture}
     */
    this.gesture = gesture;

    /**
     * The function handler to execute when the gesture is recognized on the
     * associated element.
     *
     * @member {Function}
     */
    this.handler = handler;
  }

  /**
   * Evalutes the given gesture hook, and dispatches any data that is produced.
   *
   * @param {String} hook - which gesture hook to call, must be one of 'start', 
   *    'move', or 'end'.
   * @param {State} state - The current State instance.
   * @return {undefined}
   */
  evaluateHook(hook, state) {
    const data = this.gesture[hook](state);
    if (data) {
      data.phase = hook;
      data.event = state.event;
      data.type = this.gesture.type;
      this.handler(data);
    }
  }
}

module.exports = Binding;


},{}],4:[function(require,module,exports){
/**
 * @file Contains the {@link Gesture} class
 */

'use strict';

let nextGestureNum = 0;

/**
 * The Gesture class that all gestures inherit from.
 */
class Gesture {
  /**
   * Constructor function for the Gesture class.
   */
  constructor(type) {
    /**
     * The type or name of the gesture. (e.g. 'pan' or 'tap' or 'pinch').
     *
     * @member {String}
     */
    if (typeof type === 'undefined') throw 'Gestures require a type!';
    this.type = type;

    /**
     * The unique identifier for each gesture. This allows for distinctions
     * across instances of Gestures that are created on the fly (e.g.
     * gesture-tap-1, gesture-tap-2).
     *
     * @member {String}
     */
    this.id = `gesture-${this.type}-${nextGestureNum++}`;
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   * @return {(null|undefined|Object)} - Default is undefined. Gesture is
   *    considered recognized if an Object is returned.
   */
  start(state) {
    return void state;
  }

  /**
   * Event hook for the move of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   * @return {(null|undefined|Object)} - Default is undefined. Gesture is
   *    considered recognized if an Object is returned.
   */
  move(state) {
    return void state;
  }

  /**
   * Event hook for the move of a gesture.
   *
   * @param {State} state - The input state object of the current region.
   * @return {(null|undefined|Object)} - Default is undefined. Gesture is
   *    considered recognized if an Object is returned.
   */
  end(state) {
    return void state;
  }
}

module.exports = Gesture;


},{}],5:[function(require,module,exports){
/**
 * @file Contains the {@link Input} class
 */

'use strict';

const PointerData = require('./PointerData.js');

/**
 * Tracks a single input and contains information about the current, previous,
 * and initial events. Contains the progress of each Input and its associated
 * gestures.
 */
class Input {
  /**
   * Constructor function for the Input class.
   *
   * @param {(PointerEvent | MouseEvent | TouchEvent)} event - The input event
   *    which will initialize this Input object.
   * @param {Number} identifier - The identifier for this input, so that it can
   *    be located in subsequent Event objects.
   */
  constructor(event, identifier) {
    const currentData = new PointerData(event, identifier);

    /**
     * The set of elements along the original event's propagation path at the
     * time it was dispatched.
     *
     * @member {WeakSet.<Element>}
     */
    this.initialElements = getElementsInPath(event);

    /**
     * Holds the initial data from the mousedown / touchstart / pointerdown that
     * began this input.
     *
     * @member {PointerData}
     */
    this.initial = currentData;

    /**
     * Holds the most current pointer data for this Input.
     *
     * @member {PointerData}
     */
    this.current = currentData;

    /**
     * Holds the previous pointer data for this Input.
     *
     * @member {PointerData}
     */
    this.previous = currentData;

    /**
     * The identifier for the pointer / touch / mouse button associated with
     * this input.
     *
     * @member {Number}
     */
    this.identifier = identifier;

    /**
     * Stores internal state between events for each gesture based off of the
     * gesture's id.
     *
     * @member {Object}
     */
    this.progress = {};
  }

  /**
   * The phase of the input: 'start' or 'move' or 'end'
   *
   * @type {String} 
   */
  get phase() { return this.current.type; }

  /**
   * The timestamp of the initiating event for this input.
   *
   * @type {Number}
   */
  get startTime() { return this.initial.time; }

  /**
   * @param {String} id - The ID of the gesture whose progress is sought.
   * @return {Object} The progress of the gesture.
   */
  getProgressOfGesture(id) {
    if (!this.progress[id]) {
      this.progress[id] = {};
    }
    return this.progress[id];
  }

  /**
   * @return {Number} The distance between the initiating event for this input
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
   * @param {Event} event - The event object to wrap with a PointerData.
   * @return {undefined}
   */
  update(event) {
    this.previous = this.current;
    this.current = new PointerData(event, this.identifier);
  }

  /**
   * Determines if this PointerData was inside the given element at the time it
   * was dispatched.
   *
   * @param {Element} element
   * @return {Boolean} true if the PointerData occurred inside the element,
   *    false otherwise.
   */
  wasInitiallyInside(element) {
    return this.initialElements.has(element);
  }
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
 * In case event.composedPath() is not available.
 *
 * @private
 * @param {Event} event
 * @return {Element[]}
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

module.exports = Input;


},{"./PointerData.js":8}],6:[function(require,module,exports){
/**
 * @file Contains the PHASE object, which translates event names to phases
 * (a.k.a. hooks).
 */

'use strict';

/**
 * Normalizes window events to be either of type start, move, or end.
 *
 * @private
 */
const PHASE = Object.freeze({
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

module.exports = PHASE;


},{}],7:[function(require,module,exports){
/**
 * @file Contains the {@link Point2D} class.
 */

'use strict';

/**
 * The Point2D class stores and operates on 2-dimensional points, represented as
 * x and y coordinates.
 */
class Point2D {
  /**
   * Constructor function for the Point2D class.
   *
   * @param {Number} x - The x coordinate of the point.
   * @param {Number} y - The y coordinate of the point.
   */
  constructor(x = 0, y = 0) {
    /**
     * The x coordinate of the point.
     *
     * @member {Number}
     */
    this.x = x;

    /**
     * The y coordinate of the point.
     *
     * @member {Number}
     */
    this.y = y;
  }

  /**
   * Calculates the angle between this point and the given point.
   *
   * @param {Point2D} point - Projected point for calculating the angle.
   * @return {Number} Radians along the unit circle where the projected point
   *    lies.
   */
  angleTo(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }

  /**
   * Determine the average distance from this point to the provided array of
   * points.
   *
   * @param {Point2D[]} points - the Point2D objects to calculate the average
   *    distance to.
   * @return {Number} The average distance from this point to the provided
   *    points.
   */
  averageDistanceTo(points = []) {
    return this.totalDistanceTo(points) / points.length;
  }

  /**
   * Clone this point.
   *
   * @return {Point2D} A new Point2D, identical to this point.
   */
  clone() {
    return new Point2D(this.x, this.y);
  }

  /**
   * Calculates the distance between two points.
   *
   * @param {Point2D} point - Point to which the distance is calculated.
   * @return {Number} The distance between the two points, a.k.a. the
   *    hypoteneuse. 
   */
  distanceTo(point) {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  /**
   * Subtract the given point from this point.
   *
   * @param {Point2D} point - Point to subtract from this point.
   * @return {Point2D} A new Point2D, which is the result of (this - point).
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
   * @param {Point2D} point - Point to add to this point.
   * @return {Point2D} A new Point2D, which is the addition of the two points.
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
   * @param {Point2D[]} points - The array of Point2D objects to calculate the
   *    total distance to.
   * @return {Number} The total distance from this point to the provided points.
   */
  totalDistanceTo(points = []) {
    return points.reduce( (d, p) => d + this.distanceTo(p), 0);
  }

  /**
   * Calculates the midpoint of a list of points.
   *
   * @param {Point2D[]} points - The array of Point2D objects for which to
   *    calculate the midpoint
   * @return {Point2D} The midpoint of the provided points.
   */
  static midpoint(points = []) {
    if (points.length === 0) return null;

    const total = Point2D.sum(points);
    return new Point2D (
      total.x / points.length,
      total.y / points.length,
    );
  }

  /**
   * Calculates the sum of the given points.
   *
   * @param {Point2D[]} points - The Point2D objects to sum up.
   * @return {Point2D} A new Point2D representing the sum of the given points.
   */
  static sum(points = []) {
    return points.reduce( (total, pt) => total.plus(pt), new Point2D(0,0) );
  }
}

module.exports = Point2D;


},{}],8:[function(require,module,exports){
/**
 * @file Contains the {@link PointerData} class
 */

'use strict';

const Point2D = require('./Point2D.js');
const PHASE   = require('./PHASE.js');

/**
 * Low-level storage of pointer data based on incoming data from an interaction
 * event.
 */
class PointerData {
  /**
   * @constructor
   *
   * @param {Event} event - The event object being wrapped.
   * @param {Number} identifier - The index of touch if applicable
   */
  constructor(event, identifier) {
    /**
     * The original event object.
     *
     * @member {Event}
     */
    this.originalEvent = event;

    /**
     * The type or 'phase' of this batch of pointer data. 'start' or 'move' or
     * 'end'.
     *
     * @member {( String | null )}
     */
    this.type = PHASE[ event.type ];

    /**
     * The timestamp of the event in milliseconds elapsed since January 1, 1970,
     * 00:00:00 UTC.
     * 
     * @member {Number}
     */
    this.time = Date.now();

    const eventObj = getEventObject(event, identifier);
    /**
     * The (x,y) coordinate of the event, wrapped in a Point2D.
     *
     * @member {Point2D}
     */
    this.point = new Point2D(eventObj.clientX, eventObj.clientY);
  }

  /**
   * Calculates the angle between this event and the given event.
   *
   * @param {PointerData} pdata
   * @return {Number} - Radians measurement between this event and the given
   *    event's points.
   */
  angleTo(pdata) {
    return this.point.angleTo(pdata.point);
  }

  /**
   * Calculates the distance between two PointerDatas.
   *
   * @param {PointerData} pdata
   * @return {Number} The distance between the two points, a.k.a. the
   *    hypoteneuse. 
   */
  distanceTo(pdata) {
    return this.point.distanceTo(pdata.point);
  }
}

/**
 * @private
 * @return {Event} The Event object which corresponds to the given identifier.
 *    Contains clientX, clientY values.
 */
function getEventObject(event, identifier) {
  if (event.changedTouches) {
    return Array.from(event.changedTouches).find( t => {
      return t.identifier === identifier;
    });
  } 
  return event;
}

module.exports = PointerData;


},{"./PHASE.js":6,"./Point2D.js":7}],9:[function(require,module,exports){
/**
 * @file Contains the {@link Region} class
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

/** 
 * Allows the user to specify the control region which will listen for user
 * input events.
 */
class Region {
  /**
   * Constructor function for the Region class.
   *
   * @param {Element} element - The element which should listen to input events.
   * @param {Boolean} capture - Whether the region uses the capture phase of
   *    input events. If false, uses the bubbling phase.
   * @param {Boolean} preventDefault - Whether the default browser functionality
   *    should be disabled. This option should most likely be ignored. Here
   *    there by dragons if set to false.
   */
  constructor(element, capture = false, preventDefault = true) {
    /**
     * The list of relations between elements, their gestures, and the handlers.
     *
     * @member {Binding[]}
     */
    this.bindings = [];

    /**
     * The element being bound to.
     *
     * @member {Element}
     */
    this.element = element;

    /**
     * Whether the region listens for captures or bubbles.
     *
     * @member {Boolean}
     */
    this.capture = capture;

    /**
     * Whether the default browser functionality should be disabled. This option
     * should most likely be ignored. Here there by dragons if set to false.
     *   
     * @member {Boolean}
     */
    this.preventDefault = preventDefault;

    /**
     * The internal state object for a Region.  Keeps track of inputs.
     *
     * @member {State}
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
   * @return {undefined}
   */
  activate() {
    /*
     * Having to listen to both mouse and touch events is annoying, but
     * necessary due to conflicting standards and browser implementations.
     * Pointer is a fallback instead of the primary because it lacks useful
     * properties such as 'ctrlKey' and 'altKey'.
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
    eventNames.forEach( eventName => {
      this.element.addEventListener(eventName, arbiter, {
        capture: this.capture,
        once: false,
        passive: false,
      });
    });
  }

  /**
   * All input events flow through this function. It makes sure that the input
   * state is maintained, determines which bindings to analyze based on the
   * initial position of the inputs, calls the relevant gesture hooks, and
   * dispatches gesture data.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   * @return {undefined}
   */
  arbitrate(event) {
    if (this.preventDefault) event.preventDefault();

    this.state.updateAllInputs(event, this.element);

    this.retrieveBindingsByInitialPos().forEach( binding => {
      binding.evaluateHook(PHASE[ event.type ], this.state);
    });

    this.state.clearEndedInputs();
  }

  /**
   * Bind an element to a gesture with multiple function signatures.
   *
   * @param {Element} element - The element object.
   * @param {Gesture} gesture - Gesture type with which to bind.
   * @param {Function} handler - The function to execute when a gesture is
   *    recognized.
   * @return {undefined}
   */
  bind(element, gesture, handler) {
    this.bindings.push( new Binding(element, gesture, handler) );
  }

  /**
   * Retrieves Bindings by their associated element.
   *
   * @private
   * @param {Element} element - The element for which to find bindings.
   * @return {Binding[]} - Bindings to which the element is bound.
   */
  retrieveBindingsByElement(element) {
    return this.bindings.filter( b => b.element === element );
  }

  /**
   * Retrieves all bindings based upon the initial X/Y position of the inputs.
   * e.g. if gesture started on the correct target element, but diverted away
   * into the correct region, this would still be valid.
   *
   * @private
   * @return {Binding[]} - Bindings in which an active input began.
   */
  retrieveBindingsByInitialPos() {
    return this.bindings.filter( 
      b => this.state.someInputWasInitiallyInside(b.element)
    );
  }

  /**
   * Unbinds an element from either the specified gesture or all if no gesture
   * is specified.
   *
   * @param {Element} element - The element to unbind.
   * @param {Gesture} [ gesture ] - The gesture to unbind. If undefined, will
   *    unbind all Bindings associated with the given element.
   * @return {Binding[]} - Bindings that were unbound to the element.
   */
  unbind(element, gesture) {
    let bindings = this.retrieveBindingsByElement(element);
    let unbound = [];

    bindings.forEach( b => {
      if (gesture == undefined || b.gesture === gesture) {
        this.bindings.splice(this.bindings.indexOf(b), 1);
        unbound.push(b);
      }
    });

    return unbound;
  }
}

module.exports = Region;


},{"./Binding.js":3,"./PHASE.js":6,"./State.js":10}],10:[function(require,module,exports){
/**
 * @file Contains the {@link State} class
 */

'use strict';

const Input   = require('./Input.js');
const PHASE   = require('./PHASE.js');
const Point2D = require('./Point2D.js');

/**
 * Keeps track of currently active and ending input points on the interactive
 * surface.
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
     * @member {Object}
     */
    this._inputs_obj = {};

    /**
     * All currently valid inputs, including those that have ended.
     * 
     * @member {Input[]}
     */
    this.inputs = [];

    /**
     * The array of currently active inputs, sourced from the current Input
     * objects. "Active" is defined as not being in the 'end' phase.
     *
     * @member {Input[]}
     */
    this.active = [];

    /**
     * The array of latest point data for the currently active inputs, sourced
     * from this.active.
     *
     * @member {Point2D[]}
     */
    this.activePoints = [];

    /**
     * The centroid of the currently active points.
     *
     * @member {Point2D}
     */
    this.centroid = {};

    /**
     * The latest event that the state processed.
     *
     * @member {Event}
     */
    this.event = null;
  }

  /**
   * Deletes all inputs that are in the 'end' phase.
   *
   * @return {undefined}
   */
  clearEndedInputs() {
    for (let k in this._inputs_obj) {
      if (this._inputs_obj[k].phase === 'end') delete this._inputs_obj[k];
    }
  }

  /**
   * @param {String} phase - One of 'start', 'move', or 'end'
   * @return {Input[]} Inputs in the given phase.
   */
  getInputsInPhase(phase) {
    return this.inputs.filter( i => i.phase === phase );
  }

  /**
   * @param {String} phase - One of 'start', 'move', or 'end'
   * @return {Input[]} Inputs _not_ in the given phase.
   */
  getInputsNotInPhase(phase) {
    return this.inputs.filter( i => i.phase !== phase );
  }

  /**
   * @param {Element} element - The Element to test.
   * @return {Boolean} True if some input was initially inside the element.
   */
  someInputWasInitiallyInside(element) {
    return this.inputs.some( i => i.wasInitiallyInside(element) );
  }

  /**
   * Update the input with the given identifier using the given event.
   *
   * @param {Event} event - The event being captured.
   * @param {Number} identifier - The identifier of the input to update.
   * @return {undefined}
   */
  updateInput(event, identifier) {
    if (PHASE[ event.type ] === 'start') {
      this._inputs_obj[identifier] = new Input(event, identifier);
    } else if (this._inputs_obj[identifier]) {
      this._inputs_obj[identifier].update(event);
    }
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   *
   * @param {Event} event - The event being captured. 
   * @return {undefined}
   */
  updateAllInputs(event) {
    update_fns[event.constructor.name].call(this, event);
    this.inputs = Object.values(this._inputs_obj);
    this.active = this.getInputsNotInPhase('end');
    this.activePoints = this.active.map( i => i.current.point );
    this.centroid = Point2D.midpoint( this.activePoints );
    this.event = event;
  }
}

/*
 * Set of helper functions for updating inputs based on type of input.
 * Must be called with a bound 'this', via bind(), or call(), or apply().
 * 
 * @private
 */
const update_fns = {
  TouchEvent: function(event) {
    Array.from(event.changedTouches).forEach( touch => {
      this.updateInput(event, touch.identifier);
    });
  },

  PointerEvent: function(event) {
    this.updateInput(event, event.pointerId);
  },

  MouseEvent: function(event) {
    this.updateInput(event, event.button);
  },
};

module.exports = State;


},{"./Input.js":5,"./PHASE.js":6,"./Point2D.js":7}],11:[function(require,module,exports){
/**
 * @file Contains the Pan class.
 */

'use strict';

const { Gesture } = require('westures-core');

const DEFAULT_MIN_THRESHOLD = 1;
const REQUIRED_INPUTS = 1;

/**
 * @typedef PanData
 * @type {Object}
 * @property {Point2D} change - The change vector from the last emit.
 * @property {Number} change.x - movement along x axis.
 * @property {Number} change.y - movement along y axis.
 * @property {Point2D} point - The centroid of the currently active points.
 * @property {Number} point.x - x coordinate of centroid.
 * @property {Number} point.y - y coordinate of centroid.
 */

/**
 * A Pan is defined as a normal movement in any direction. 
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Pan extends Gesture {
  /**
   * @param {Object} [options]
   * @param {String} [options.muteKey=undefined] - If this key is pressed, this
   *    gesture will be muted (i.e. not recognized). One of 'altKey', 'ctrlKey',
   *    'shiftKey', or 'metaKey'.
   */
  constructor(options = {}) {
    super('pan');

    /**
     * Don't emit any data if this key is pressed.
     *
     * @type {String}
     */
    this.muteKey = options.muteKey;
  }

  /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @private
   * @param {State} state - The state object received by a hook.
   */
  initialize(state) {
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.lastEmitted = state.centroid;
  }

  /**
   * Event hook for the start of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }

  /**
   * Event hook for the move of a Pan.
   *
   * @param {State} state - current input state.
   * @return {?PanData} `null` if the gesture is muted by the muteKey,
   *    otherwise returns a data object.
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    if (this.muteKey && state.event[this.muteKey]) {
      this.initialize(state);
      return null;
    }

    const progress = state.active[0].getProgressOfGesture(this.id);
    const point = state.centroid;
    const change = point.minus(progress.lastEmitted);
    progress.lastEmitted = point;

    return { change, point };
  }

  /**
   * Event hook for the end of a Pan. Records the current centroid of
   * the inputs.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined} 
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.initialize(state);
  }
}

module.exports = Pan;


},{"westures-core":2}],12:[function(require,module,exports){
/**
 * @file Contains the abstract Pinch class.
 */

'use strict';

const { Gesture } = require('westures-core');

const DEFAULT_MIN_INPUTS = 2;

/**
 * @typedef PinchData
 * @type {Object}
 * @property {Number} distance - The average distance from an active input to
 *    the centroid.
 * @property {Number} change - The change in distance since last emit.
 * @property {Point2D} midpoint - The centroid of the currently active points.
 * @property {Number} midpoint.x - x coordinate of centroid.
 * @property {Number} midpoint.y - y coordinate of centroid.
 */

/**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Pinch extends Gesture {
  /**
   * Constructor function for the Pinch class.
   *
   * @param {Object} [options]
   * @param {Number} [options.minInputs=2] The minimum number of inputs that
   *    must be active for a Pinch to be recognized.
   */
  constructor(options = {}) {
    super('pinch');

    /**
     * The minimum number of inputs that must be active for a Pinch to be
     * recognized.
     *
     * @type {Number}
     */
    this.minInputs = options.minInputs || DEFAULT_MIN_INPUTS;
  }

  /**
   * Initializes the gesture progress and stores it in the first input for
   * reference events.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  initializeProgress(state) {
    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const progress = state.active[0].getProgressOfGesture(this.id);
    progress.previousDistance = distance;
  }

  /**
   * Event hook for the start of a Pinch.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }

  /**
   * Event hook for the move of a Pinch.
   *
   * @param {State} state - current input state.
   * @return {?PinchData} - null if not recognized.
   */
  move(state) {
    if (state.active.length < this.minInputs) return null;

    const distance = state.centroid.averageDistanceTo(state.activePoints);
    const progress = state.active[0].getProgressOfGesture(this.id);
    const change = distance / progress.previousDistance;
    progress.previousDistance = distance;

    return {
      distance,
      midpoint: state.centroid,
      change,
    };
  }

  /**
   * Event hook for the end of a Pinch.
   *
   * @private
   * @param {State} input status object
   * @return {undefined}
   */
  end(state) {
    if (state.active.length < this.minInputs) return null;
    this.initializeProgress(state);
  }
}

module.exports = Pinch;


},{"westures-core":2}],13:[function(require,module,exports){
/**
 * @file Contains the Rotate class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 2;

/**
 * @typedef RotateData
 * @type {Object}
 * @property {Number} delta - In radians, the change in angle since last emit.
 * @property {Point2D} pivot - The centroid of the currently active points.
 * @property {Number} pivot.x - x coordinate of centroid.
 * @property {Number} pivot.y - y coordinate of centroid.
 */

/**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor() {
    super('rotate');
  }

  /**
   * Store individual angle progress on each input, return average angle change.
   *
   * @private
   * @param {State} state - current input state.
   * @return {null}
   */
  getAngle(state) {
    let angle = 0;
    state.active.forEach( i => {
      const progress = i.getProgressOfGesture(this.id);
      const currentAngle = state.centroid.angleTo(i.current.point);
      angle += angularMinus(currentAngle, progress.previousAngle);
      progress.previousAngle = currentAngle;
    });
    angle /= (state.active.length);
    return angle;
  }

  /**
   * Event hook for the start of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }

  /**
   * Event hook for the move of a Rotate gesture.
   *
   * @param {State} state - current input state.
   * @return {?RotateData} - null if this event did not occur
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    return {
      pivot: state.centroid,
      delta: this.getAngle(state),
    };
  }

  /**
   * Event hook for the end of a gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  end(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;
    this.getAngle(state);
  }
}

/*
 * Helper function to regulate angular differences, so they don't jump from 0 to
 * 2*PI or vice versa.
 */
const PI2 = 2 * Math.PI;
function angularMinus(a, b = 0) {
  let diff = a - b;
  if (diff < -Math.PI) {
    diff += PI2;
  } else if (diff > Math.PI) {
    diff -= PI2;
  }
  return diff;
}

module.exports = Rotate;


},{"westures-core":2}],14:[function(require,module,exports){
/**
 * @file Contains the Swipe class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const PROGRESS_STACK_SIZE = 5;

/**
 * @typedef SwipeData
 * @type {Object}
 * @property {Number} velocity - The velocity of the swipe.
 * @property {Number} direction - In radians, the direction of the swipe.
 * @property {Point2D} point - The point at which the swipe ended.
 * @property {Number} point.x - x coordinate of point.
 * @property {Number} point.y - y coordinate of point.
 */

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Swipe extends Gesture {
  /**
   * Constructor function for the Swipe class.
   */
  constructor() {
    super('swipe');
  }

  /**
   * Event hook for the move of a gesture. Captures an input's x/y coordinates
   * and the time of it's event on a stack.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  move(state) {
    if (state.active.length < REQUIRED_INPUTS) return null;

    state.active.forEach( input => {
      const progress = input.getProgressOfGesture(this.id);
      if (!progress.moves) progress.moves = [];

      progress.moves.push({
        time: Date.now(),
        point: input.current.point,
      });

      while (progress.moves.length > PROGRESS_STACK_SIZE) {
        progress.moves.shift();
      }
    });

    return null;
  }

  /**
   * Determines if the input's history validates a swipe motion.
   *
   * @param {State} state - current input state.
   * @return {?SwipeData} - null if the gesture is not recognized.
   */
  end(state) {
    const ended = state.getInputsInPhase('end');

    if (ended.length !== REQUIRED_INPUTS) return null;

    const progress = ended[0].getProgressOfGesture(this.id);
    if (!progress.moves || progress.moves.length < PROGRESS_STACK_SIZE) {
      return null;
    }
    const moves = progress.moves;

    const vlim = PROGRESS_STACK_SIZE - 1;
    const point = moves[vlim].point;
    const velos = [];
    let direction = 0;
    for (let i = 0; i < vlim; ++i) {
      velos[i] = calc_velocity(moves[i], moves[i + 1]);
      direction += moves[i].point.angleTo(point);
    }
    direction /= vlim;

    const velocity = velos.reduce((acc,cur) => cur > acc ? cur : acc);

    return {
      point,
      velocity,
      direction,
    };
  }
}

/*
 * Local helper function for calculating the velocity between two timestamped
 * points.
 */
function calc_velocity(start, end) {
  const distance = end.point.distanceTo(start.point);
  const time = end.time - start.time;
  return distance / time;
}

module.exports = Swipe;


},{"westures-core":2}],15:[function(require,module,exports){
/**
 * @file Contains the Rotate class.
 */

'use strict';

const { Gesture } = require('westures-core');

const REQUIRED_INPUTS = 1;
const defaults = Object.freeze({
  deadzoneRadius: 10,
});

/**
 * @typedef SwivelData
 * @type {Object}
 * @property {Number} delta - In radians, the change in angle since last emit.
 * @property {Point2D} pivot - The pivot point.
 * @property {Number} pivot.x - x coordinate of pivot.
 * @property {Number} pivot.y - y coordinate of pivot.
 * @property {Point2D} point - The current location of the input point.
 * @property {Number} point.x - x coordinate of point.
 * @property {Number} point.y - y coordinate of point.
 */

/**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Swivel extends Gesture {
  /**
   * Constructor for the Swivel class.
   *
   * @param {Object} [options]
   * @param {Number} [options.deadzoneRadius=10] - The radius in pixels around
   *    the start point in which to do nothing.
   * @param {String} [options.enableKey=undefined] - One of 'altKey', 'ctrlKey',
   *    'metaKey', or 'shiftKey'. If set, gesture will only be recognized while
   *    this key is down.
   */
  constructor(options = {}) {
    super('swivel');

    /**
     * The radius around the start point in which to do nothing.
     */
    this.deadzoneRadius = options.deadzoneRadius || defaults.deadzoneRadius;

    /**
     * If this is set, gesture will only respond to events where this property
     * is truthy. Should be one of 'ctrlKey', 'altKey', or 'shiftKey'.
     */
    this.enableKey = options.enableKey;
  }

  /**
   * Returns whether this gesture is currently enabled.
   */
  enabled(event) {
    return !this.enableKey || event[this.enableKey];
  }

  /**
   * Event hook for the start of a Swivel gesture.
   *
   * @private
   * @param {State} state - current input state.
   * @return {undefined}
   */
  start(state) {
    if (!this.enabled(state.event)) return null;

    const started = state.getInputsInPhase('start');
    if (started.length !== REQUIRED_INPUTS) return null;

    const progress = started[0].getProgressOfGesture(this.id);
    progress.pivot = started[0].current.point;
    progress.previousAngle = 0;
  }

  /**
   * Event hook for the move of a Swivel gesture.
   *
   * @param {State} state - current input state.
   * @return {?SwivelData} - null if the gesture is not recognized.
   */
  move(state) {
    if (state.active.length !== REQUIRED_INPUTS) return null;

    const input = state.active[0];

    const progress = input.getProgressOfGesture(this.id);
    if (this.enabled(state.event)) {
      if (!progress.pivot) {
        // Restart: enableKey was just pressed again.
        progress.pivot = input.current.point;
        progress.previousAngle = 0;
        return null;
      }

      const point = input.current.point;
      const pivot = progress.pivot;
      const angle = pivot.angleTo(point);
      const delta = angle - progress.previousAngle;
      progress.previousAngle = angle;

      if (pivot.distanceTo(point) <= this.deadzoneRadius) {
        return null;
      } else {
        return { delta, pivot, point };
      }
    } else {
      // CTRL key was released, therefore pivot point is now invalid.
      delete progress.pivot;
    }
  }
}

module.exports = Swivel;


},{"westures-core":2}],16:[function(require,module,exports){
/**
 * @file Contains the Tap class.
 */

'use strict';

const { Gesture, Point2D } = require('westures-core');

const defaults = Object.freeze({
  MIN_DELAY_MS: 0,
  MAX_DELAY_MS: 300,
  NUM_INPUTS: 1,
  MOVE_PX_TOLERANCE: 10,
});

/**
 * @typedef TapData
 * @type {Object}
 * @property {Number} x - x coordinate of tap point.
 * @property {Number} y - y coordinate of tap point.
 */

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   *
   * @param {Object} [options] - The options object.
   * @param {Number} [options.minDelay=0] - The minimum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.maxDelay=300] - The maximum delay between a
   *    touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {Number} [options.tolerance=10] - The tolerance in pixels a user can
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
     * @type {Number}
     */
    this.minDelay = options.minDelay || defaults.MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     *
     * @type {Number}
     */
    this.maxDelay = options.maxDelay || defaults.MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable, and the maximum
     * number being a factor of the browser.
     *
     * @type {Number}
     */
    this.numInputs = options.numInputs || defaults.NUM_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     *
     * @type {number}
     */
    this.tolerance = options.tolerance || defaults.MOVE_PX_TOLERANCE;

    /**
     * An array of inputs that have ended recently.
     */
    this.ended = [];
  }
  /* constructor*/

  /**
   * Event hook for the end of a gesture.  Determines if this the tap event can
   * be fired if the delay and tolerance constraints are met. 
   *
   * @param {State} state - current input state.
   * @return {?TapData} - null if the gesture is not to be emitted, Object
   *    with information otherwise. 
   */
  end(state) {
    const now = Date.now();

    this.ended = this.ended.concat(state.getInputsInPhase('end'))
      .filter( i => {
        const tdiff = now - i.startTime;
        return tdiff <= this.maxDelay && tdiff >= this.minDelay;
      });

    if (this.ended.length === 0 ||
        this.ended.length !== this.numInputs || 
        !this.ended.every( i => i.totalDistance() <= this.tolerance)) {
      return null;
    }

    const { x, y } = Point2D.midpoint( this.ended.map( i => i.current.point ) );
    return { x, y };
  }
  /* end*/
}

module.exports = Tap;


},{"westures-core":2}],17:[function(require,module,exports){
/**
 * @file Contains the Track class.
 */

'use strict';

const { Gesture } = require('westures-core');

/**
 * @typedef TrackData
 * @type {Object}
 * @property {Point2D[]} active - Points currently in 'start' or 'move' phase.
 * @property {Point2D} centroid - centroid of currently active points.
 * @property {Number} centroid.x - x coordinate of centroid.
 * @property {Number} centroid.y - y coordinate of centroid.
 */

/**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 *
 * @extends Gesture 
 * @see {@link https://mvanderkamp.github.io/westures-core/Gesture.html Gesture}
 */
class Track extends Gesture {
  /**
   * Constructor for the Track class.
   *
   * @param {String[]} [phases] Phases to recognize. Entries can be any or all
   *    of 'start', 'move', and 'end'.
   */
  constructor(phases = []) {
    super('track');
    this.trackStart = phases.includes('start');
    this.trackMove  = phases.includes('move');
    this.trackEnd   = phases.includes('end');
  }

  /**
   * @private
   * @param {State} state - current input state.
   * @return {TrackData}
   */
  data({ activePoints, centroid }) {
    return { active: activePoints, centroid }; 
  }

  /**
   * Event hook for the start of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  start(state) {
    if (this.trackStart) return this.data(state);
  }

  /**
   * Event hook for the move of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  move(state) {
    if (this.trackMove) return this.data(state);
  }

  /**
   * Event hook for the end of a Track gesture.
   *
   * @param {State} state - current input state.
   * @return {?TrackData} - null if not recognized.
   */
  end(state) {
    if (this.trackEnd) return this.data(state);
  }
}

module.exports = Track;


},{"westures-core":2}]},{},[1])(1)
});
