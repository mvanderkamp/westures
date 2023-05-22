/**
 * The API interface for Westures. Defines a number of gestures on top of the
 * engine provided by {@link
 * https://mvanderkamp.github.io/westures-core/index.html|westures-core}.
 *
 * @namespace westures
 */ "use strict";
var $17807945cdde5d67$exports = {};
/**
 * The global API interface for westures-core. Exposes all classes, constants,
 * and routines used by the package. Use responsibly.
 *
 * @namespace westures-core
 */ "use strict";
var $17807945cdde5d67$var$$de0d6a332419bf3c$exports = {};
"use strict";
let $17807945cdde5d67$var$$de0d6a332419bf3c$var$g_id = 0;
/**
 * The Gesture class that all gestures inherit from. A custom gesture class will
 * need to override some or all of the four phase "hooks": start, move, end, and
 * cancel.
 *
 * @memberof westures-core
 *
 * @param {string} type - The name of the gesture.
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 *    is recognized on the associated element.
 * @param {object} [options] - Generic gesture options
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 */ class $17807945cdde5d67$var$$de0d6a332419bf3c$var$Gesture {
    constructor(type, element, handler, options = {}){
        if (typeof type !== "string") throw new TypeError("Gestures require a string type / name");
        /**
     * The name of the gesture. (e.g. 'pan' or 'tap' or 'pinch').
     *
     * @type {string}
     */ this.type = type;
        /**
     * The unique identifier for each gesture. This allows for distinctions
     * across instances of Gestures that are created on the fly (e.g.
     * gesture-tap-1, gesture-tap-2).
     *
     * @type {string}
     */ this.id = `gesture-${this.type}-${$17807945cdde5d67$var$$de0d6a332419bf3c$var$g_id++}`;
        /**
     * The element to which to associate the gesture.
     *
     * @type {Element}
     */ this.element = element;
        /**
     * The function handler to execute when the gesture is recognized on the
     * associated element.
     *
     * @type {Function}
     */ this.handler = handler;
        /**
     * The options. Can usually be adjusted live, though be careful doing this.
     *
     * @type {object}
     */ this.options = {
            ...$17807945cdde5d67$var$$de0d6a332419bf3c$var$Gesture.DEFAULTS,
            ...options
        };
    }
    /**
   * Determines whether this gesture is enabled.
   *
   * @param {westures-core.State} state - The input state object of the current
   * region.
   *
   * @return {boolean} true if enabled, false otherwise.
   */ isEnabled(state) {
        const count = state.active.length;
        const event = state.event;
        const { enableKeys: enableKeys , disableKeys: disableKeys , minInputs: minInputs , maxInputs: maxInputs  } = this.options;
        return minInputs <= count && maxInputs >= count && (enableKeys.length === 0 || enableKeys.some((k)=>event[k])) && !disableKeys.some((k)=>event[k]);
    }
    /**
   * Event hook for the start phase of a gesture.
   *
   * @param {westures-core.State} state - The input state object of the current
   * region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */ start() {
        return null;
    }
    /**
   * Event hook for the move phase of a gesture.
   *
   * @param {westures-core.State} state - The input state object of the current
   * region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */ move() {
        return null;
    }
    /**
   * Event hook for the end phase of a gesture.
   *
   * @param {westures-core.State} state - The input state object of the current
   * region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */ end() {
        return null;
    }
    /**
   * Event hook for when an input is cancelled.
   *
   * @param {westures-core.State} state - The input state object of the current
   * region.
   *
   * @return {?Object} Gesture is considered recognized if an Object is
   *    returned.
   */ cancel() {
        return null;
    }
    /**
   * Evalutes the given gesture hook, and dispatches any data that is produced
   * by calling [recognize]{@link westures-core.Gesture#recognize}.
   *
   * @param {string} hook - Must be one of 'start', 'move', 'end', or 'cancel'.
   * @param {westures-core.State} state - The current State instance.
   */ evaluateHook(hook, state) {
        const data = this[hook](state);
        if (data) this.recognize(hook, state, data);
    }
    /**
   * Recognize a Gesture by calling the handler. Standardizes the way the
   * handler is called so that classes extending Gesture can circumvent the
   * evaluateHook approach but still provide results that have a common format.
   *
   * Note that the properties in the "data" object will receive priority when
   * constructing the results. This can be used to override standard results
   * such as the phase or the centroid.
   *
   * @param {string} hook - Must be one of 'start', 'move', 'end', or 'cancel'.
   * @param {westures-core.State} state - current input state.
   * @param {Object} data - Results data specific to the recognized gesture.
   */ recognize(hook, state, data) {
        this.handler({
            centroid: state.centroid,
            event: state.event,
            phase: hook,
            type: this.type,
            target: this.element,
            ...data
        });
    }
}
$17807945cdde5d67$var$$de0d6a332419bf3c$var$Gesture.DEFAULTS = {
    enableKeys: [],
    disableKeys: [],
    minInputs: 1,
    maxInputs: Number.MAX_VALUE
};
$17807945cdde5d67$var$$de0d6a332419bf3c$exports = $17807945cdde5d67$var$$de0d6a332419bf3c$var$Gesture;
var $17807945cdde5d67$var$$e2125e2e71e37a0c$exports = {};
"use strict";
var $17807945cdde5d67$var$$0ca7bfe1c074e8ca$exports = {};
"use strict";
var $17807945cdde5d67$var$$6c3676f10a43b740$exports = {};
"use strict";
/**
 * The Point2D class stores and operates on 2-dimensional points, represented as
 * x and y coordinates.
 *
 * @memberof westures-core
 *
 * @param {number} [ x=0 ] - The x coordinate of the point.
 * @param {number} [ y=0 ] - The y coordinate of the point.
 */ class $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D {
    constructor(x = 0, y = 0){
        /**
     * The x coordinate of the point.
     *
     * @type {number}
     */ this.x = x;
        /**
     * The y coordinate of the point.
     *
     * @type {number}
     */ this.y = y;
    }
    /**
   * Calculates the angle between this point and the given point.
   *
   * @param {!westures-core.Point2D} point - Projected point for calculating the
   * angle.
   *
   * @return {number} Radians along the unit circle where the projected
   * point lies.
   */ angleTo(point) {
        return Math.atan2(point.y - this.y, point.x - this.x);
    }
    /**
   * Determine the angle from the centroid to each of the points.
   *
   * @param {!westures-core.Point2D[]} points - the Point2D objects to calculate
   *    the angles to.
   *
   * @returns {number[]}
   */ anglesTo(points) {
        return points.map((point)=>this.angleTo(point));
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
   */ averageDistanceTo(points) {
        return this.totalDistanceTo(points) / points.length;
    }
    /**
   * Clone this point.
   *
   * @return {westures-core.Point2D} A new Point2D, identical to this point.
   */ clone() {
        return new $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D(this.x, this.y);
    }
    /**
   * Calculates the distance between two points.
   *
   * @param {!westures-core.Point2D} point - Point to which the distance is
   * calculated.
   *
   * @return {number} The distance between the two points, a.k.a. the
   *    hypoteneuse.
   */ distanceTo(point) {
        return Math.hypot(point.x - this.x, point.y - this.y);
    }
    /**
   * Subtract the given point from this point.
   *
   * @param {!westures-core.Point2D} point - Point to subtract from this point.
   *
   * @return {westures-core.Point2D} A new Point2D, which is the result of (this
   * - point).
   */ minus(point) {
        return new $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D(this.x - point.x, this.y - point.y);
    }
    /**
   * Return the summation of this point to the given point.
   *
   * @param {!westures-core.Point2D} point - Point to add to this point.
   *
   * @return {westures-core.Point2D} A new Point2D, which is the addition of the
   * two points.
   */ plus(point) {
        return new $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D(this.x + point.x, this.y + point.y);
    }
    /**
   * Calculates the total distance from this point to an array of points.
   *
   * @param {!westures-core.Point2D[]} points - The array of Point2D objects to
   *    calculate the total distance to.
   *
   * @return {number} The total distance from this point to the provided points.
   */ totalDistanceTo(points) {
        return points.reduce((d, p)=>d + this.distanceTo(p), 0);
    }
    /**
   * Calculates the centroid of a list of points.
   *
   * @param {westures-core.Point2D[]} points - The array of Point2D objects for
   * which to calculate the centroid.
   *
   * @return {westures-core.Point2D} The centroid of the provided points.
   */ static centroid(points = []) {
        if (points.length === 0) return null;
        const total = $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D.sum(points);
        total.x /= points.length;
        total.y /= points.length;
        return total;
    }
    /**
   * Calculates the sum of the given points.
   *
   * @param {westures-core.Point2D[]} points - The Point2D objects to sum up.
   *
   * @return {westures-core.Point2D} A new Point2D representing the sum of the
   * given points.
   */ static sum(points = []) {
        return points.reduce((total, pt)=>{
            total.x += pt.x;
            total.y += pt.y;
            return total;
        }, new $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D(0, 0));
    }
}
$17807945cdde5d67$var$$6c3676f10a43b740$exports = $17807945cdde5d67$var$$6c3676f10a43b740$var$Point2D;
var $17807945cdde5d67$var$$be6f0e84320366a7$exports = {};
"use strict";
/**
 * List of events that trigger the cancel phase.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL_EVENTS = [
    "blur",
    "pointercancel",
    "touchcancel",
    "mouseleave"
];
/**
 * List of keyboard events that trigger a restart.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$KEYBOARD_EVENTS = [
    "keydown",
    "keyup"
];
/**
 * List of mouse events to listen to.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$MOUSE_EVENTS = [
    "mousedown",
    "mousemove",
    "mouseup"
];
/**
 * List of pointer events to listen to.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$POINTER_EVENTS = [
    "pointerdown",
    "pointermove",
    "pointerup"
];
/**
 * List of touch events to listen to.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$TOUCH_EVENTS = [
    "touchend",
    "touchmove",
    "touchstart"
];
/**
 * List of potentially state-modifying keys.
 * Entries are: ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$STATE_KEYS = [
    "altKey",
    "ctrlKey",
    "metaKey",
    "shiftKey"
];
/**
 * List of the 'key' values on KeyboardEvent objects of the potentially
 * state-modifying keys.
 *
 * @memberof westures-core
 * @type {string[]}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$STATE_KEY_STRINGS = [
    "Alt",
    "Control",
    "Meta",
    "Shift"
];
/**
 * The cancel phase.
 *
 * @memberof westures-core
 * @type {string}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL = "cancel";
/**
 * The end phase.
 *
 * @memberof westures-core
 * @type {string}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$END = "end";
/**
 * The move phase.
 *
 * @memberof westures-core
 * @type {string}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE = "move";
/**
 * The start phase.
 *
 * @memberof westures-core
 * @type {string}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$START = "start";
/**
 * The recognized phases.
 *
 * @memberof westures-core
 * @type {list.<string>}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$PHASES = [
    $17807945cdde5d67$var$$be6f0e84320366a7$var$START,
    $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE,
    $17807945cdde5d67$var$$be6f0e84320366a7$var$END,
    $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL
];
/**
 * Object that normalizes the names of window events to be either of type start,
 * move, end, or cancel.
 *
 * @memberof westures-core
 * @type {object}
 */ const $17807945cdde5d67$var$$be6f0e84320366a7$var$PHASE = {
    blur: $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL,
    pointercancel: $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL,
    touchcancel: $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL,
    mouseup: $17807945cdde5d67$var$$be6f0e84320366a7$var$END,
    pointerup: $17807945cdde5d67$var$$be6f0e84320366a7$var$END,
    touchend: $17807945cdde5d67$var$$be6f0e84320366a7$var$END,
    mousemove: $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE,
    pointermove: $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE,
    touchmove: $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE,
    mousedown: $17807945cdde5d67$var$$be6f0e84320366a7$var$START,
    pointerdown: $17807945cdde5d67$var$$be6f0e84320366a7$var$START,
    touchstart: $17807945cdde5d67$var$$be6f0e84320366a7$var$START
};
$17807945cdde5d67$var$$be6f0e84320366a7$exports = {
    CANCEL_EVENTS: $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL_EVENTS,
    KEYBOARD_EVENTS: $17807945cdde5d67$var$$be6f0e84320366a7$var$KEYBOARD_EVENTS,
    MOUSE_EVENTS: $17807945cdde5d67$var$$be6f0e84320366a7$var$MOUSE_EVENTS,
    POINTER_EVENTS: $17807945cdde5d67$var$$be6f0e84320366a7$var$POINTER_EVENTS,
    TOUCH_EVENTS: $17807945cdde5d67$var$$be6f0e84320366a7$var$TOUCH_EVENTS,
    STATE_KEYS: $17807945cdde5d67$var$$be6f0e84320366a7$var$STATE_KEYS,
    STATE_KEY_STRINGS: $17807945cdde5d67$var$$be6f0e84320366a7$var$STATE_KEY_STRINGS,
    CANCEL: $17807945cdde5d67$var$$be6f0e84320366a7$var$CANCEL,
    END: $17807945cdde5d67$var$$be6f0e84320366a7$var$END,
    MOVE: $17807945cdde5d67$var$$be6f0e84320366a7$var$MOVE,
    START: $17807945cdde5d67$var$$be6f0e84320366a7$var$START,
    PHASE: $17807945cdde5d67$var$$be6f0e84320366a7$var$PHASE,
    PHASES: $17807945cdde5d67$var$$be6f0e84320366a7$var$PHASES
};
var $17807945cdde5d67$var$$0ca7bfe1c074e8ca$require$PHASE = $17807945cdde5d67$var$$be6f0e84320366a7$exports.PHASE;
/**
 * @private
 * @inner
 * @memberof westures-core.PointerData
 *
 * @return {Event} The Event object which corresponds to the given identifier.
 *    Contains clientX, clientY values.
 */ function $17807945cdde5d67$var$$0ca7bfe1c074e8ca$var$getEventObject(event, identifier) {
    if (event.changedTouches) return Array.from(event.changedTouches).find((touch)=>{
        return touch.identifier === identifier;
    });
    return event;
}
/**
 * Low-level storage of pointer data based on incoming data from an interaction
 * event.
 *
 * @memberof westures-core
 *
 * @param {Event} event - The event object being wrapped.
 * @param {number} identifier - The index of touch if applicable
 */ class $17807945cdde5d67$var$$0ca7bfe1c074e8ca$var$PointerData {
    constructor(event, identifier){
        const { clientX: clientX , clientY: clientY  } = $17807945cdde5d67$var$$0ca7bfe1c074e8ca$var$getEventObject(event, identifier);
        /**
     * The original event object.
     *
     * @type {Event}
     */ this.event = event;
        /**
     * The type or 'phase' of this batch of pointer data. 'start' or 'move' or
     * 'end' or 'cancel'
     *
     * @type {string}
     */ this.type = $17807945cdde5d67$var$$0ca7bfe1c074e8ca$require$PHASE[event.type];
        /**
     * The timestamp of the event in milliseconds elapsed since January 1, 1970,
     * 00:00:00 UTC.
     *
     * @type {number}
     */ this.time = Date.now();
        /**
     * The (x,y) coordinate of the event, wrapped in a Point2D.
     *
     * @type {westures-core.Point2D}
     */ this.point = new $17807945cdde5d67$var$$6c3676f10a43b740$exports(clientX, clientY);
    }
}
$17807945cdde5d67$var$$0ca7bfe1c074e8ca$exports = $17807945cdde5d67$var$$0ca7bfe1c074e8ca$var$PointerData;
var $17807945cdde5d67$var$$4559ecf940edc78d$exports = {};
"use strict";
const $17807945cdde5d67$var$$4559ecf940edc78d$var$PI_2 = 2 * Math.PI;
const $17807945cdde5d67$var$$4559ecf940edc78d$var$PI_NVE = -Math.PI;
/**
 * Helper function to regulate angular differences, so they don't jump from 0 to
 * 2 * PI or vice versa.
 *
 * @memberof westures-core
 *
 * @param {number} a - Angle in radians.
 * @param {number} b - Angle in radians.

 * @return {number} c, given by: c = a - b such that |c| < PI
 */ function $17807945cdde5d67$var$$4559ecf940edc78d$var$angularDifference(a, b) {
    let diff = a - b;
    if (diff < $17807945cdde5d67$var$$4559ecf940edc78d$var$PI_NVE) diff += $17807945cdde5d67$var$$4559ecf940edc78d$var$PI_2;
    else if (diff > Math.PI) diff -= $17807945cdde5d67$var$$4559ecf940edc78d$var$PI_2;
    return diff;
}
/**
 * In case event.composedPath() is not available.
 *
 * @memberof westures-core
 *
 * @param {Event} event
 *
 * @return {Element[]} The elements along the composed path of the event.
 */ function $17807945cdde5d67$var$$4559ecf940edc78d$var$getPropagationPath(event) {
    if (typeof event.composedPath === "function") return event.composedPath();
    const path = [];
    for(let node = event.target; node !== document; node = node.parentNode)path.push(node);
    path.push(document);
    path.push(window);
    return path;
}
/**
 * Performs a set filter operation.
 *
 * @memberof westures-core
 *
 * @param {Set} set - The set to filter.
 * @param {Function} predicate - Function to test elements of 'set'. Receives
 * one argument: the current set element.
 *
 * @return {Set} Set consisting of elements in 'set' for which 'predicate' is
 * true.
 */ function $17807945cdde5d67$var$$4559ecf940edc78d$var$setFilter(set, predicate) {
    const result = new Set();
    set.forEach((element)=>{
        if (predicate(element)) result.add(element);
    });
    return result;
}
/**
 * Performs a set difference operation.
 *
 * @memberof westures-core
 *
 * @param {Set} left - Base set.
 * @param {Set} right - Set of elements to remove from 'left'.
 *
 * @return {Set} Set consisting of elements in 'left' that are not in
 * 'right'.
 */ function $17807945cdde5d67$var$$4559ecf940edc78d$var$setDifference(left, right) {
    return $17807945cdde5d67$var$$4559ecf940edc78d$var$setFilter(left, (element)=>!right.has(element));
}
$17807945cdde5d67$var$$4559ecf940edc78d$exports = {
    angularDifference: $17807945cdde5d67$var$$4559ecf940edc78d$var$angularDifference,
    getPropagationPath: $17807945cdde5d67$var$$4559ecf940edc78d$var$getPropagationPath,
    setDifference: $17807945cdde5d67$var$$4559ecf940edc78d$var$setDifference,
    setFilter: $17807945cdde5d67$var$$4559ecf940edc78d$var$setFilter
};
var $17807945cdde5d67$var$$e2125e2e71e37a0c$require$getPropagationPath = $17807945cdde5d67$var$$4559ecf940edc78d$exports.getPropagationPath;
/**
 * Tracks a single input and contains information about the current, previous,
 * and initial events.
 *
 * @memberof westures-core
 *
 * @param {(PointerEvent | MouseEvent | TouchEvent)} event - The input event
 * which will initialize this Input object.
 * @param {number} identifier - The identifier for this input, so that it can
 * be located in subsequent Event objects.
 */ class $17807945cdde5d67$var$$e2125e2e71e37a0c$var$Input {
    constructor(event, identifier){
        const currentData = new $17807945cdde5d67$var$$0ca7bfe1c074e8ca$exports(event, identifier);
        /**
     * The set of elements along the original event's propagation path at the
     * time it was dispatched.
     *
     * @type {WeakSet.<Element>}
     */ this.initialElements = new WeakSet($17807945cdde5d67$var$$e2125e2e71e37a0c$require$getPropagationPath(event));
        /**
     * Holds the initial data from the mousedown / touchstart / pointerdown that
     * began this input.
     *
     * @type {westures-core.PointerData}
     */ this.initial = currentData;
        /**
     * Holds the most current pointer data for this Input.
     *
     * @type {westures-core.PointerData}
     */ this.current = currentData;
        /**
     * Holds the previous pointer data for this Input.
     *
     * @type {westures-core.PointerData}
     */ this.previous = currentData;
        /**
     * The identifier for the pointer / touch / mouse button associated with
     * this input.
     *
     * @type {number}
     */ this.identifier = identifier;
    }
    /**
   * The phase of the input: 'start' or 'move' or 'end' or 'cancel'
   *
   * @type {string}
   */ get phase() {
        return this.current.type;
    }
    /**
   * The timestamp of the initiating event for this input.
   *
   * @type {number}
   */ get startTime() {
        return this.initial.time;
    }
    /**
   * The amount of time elapsed between the start of this input and its latest
   * event.
   *
   * @type {number}
   */ get elapsedTime() {
        return this.current.time - this.initial.time;
    }
    /**
   * @return {number} The distance between the initiating event for this input
   *    and its current event.
   */ totalDistance() {
        return this.initial.point.distanceTo(this.current.point);
    }
    /**
   * Saves the given raw event in PointerData form as the current data for this
   * input, pushing the old current data into the previous slot, and tossing
   * out the old previous data.
   *
   * @param {Event} event - The event object to wrap with a PointerData.
   */ update(event) {
        this.previous = this.current;
        this.current = new $17807945cdde5d67$var$$0ca7bfe1c074e8ca$exports(event, this.identifier);
    }
}
$17807945cdde5d67$var$$e2125e2e71e37a0c$exports = $17807945cdde5d67$var$$e2125e2e71e37a0c$var$Input;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$exports = {};
"use strict";
var $17807945cdde5d67$var$$639be6fb478a6d5a$exports = {};
"use strict";
var $17807945cdde5d67$var$$639be6fb478a6d5a$require$CANCEL = $17807945cdde5d67$var$$be6f0e84320366a7$exports.CANCEL;
var $17807945cdde5d67$var$$639be6fb478a6d5a$require$END = $17807945cdde5d67$var$$be6f0e84320366a7$exports.END;
var $17807945cdde5d67$var$$639be6fb478a6d5a$require$MOVE = $17807945cdde5d67$var$$be6f0e84320366a7$exports.MOVE;
var $17807945cdde5d67$var$$639be6fb478a6d5a$require$PHASE = $17807945cdde5d67$var$$be6f0e84320366a7$exports.PHASE;
var $17807945cdde5d67$var$$639be6fb478a6d5a$require$START = $17807945cdde5d67$var$$be6f0e84320366a7$exports.START;
const $17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols = {
    inputs: Symbol.for("inputs")
};
/**
 * Set of helper functions for updating inputs based on type of input.
 * Must be called with a bound 'this', via bind(), or call(), or apply().
 *
 * @private
 * @inner
 * @memberof westure-core.State
 */ const $17807945cdde5d67$var$$639be6fb478a6d5a$var$update_fns = {
    TouchEvent: function TouchEvent(event) {
        Array.from(event.changedTouches).forEach((touch)=>{
            this.updateInput(event, touch.identifier);
        });
    },
    PointerEvent: function PointerEvent(event) {
        this.updateInput(event, event.pointerId);
    },
    MouseEvent: function MouseEvent(event) {
        if (event.button === 0) this.updateInput(event, event.button);
    }
};
/**
 * Keeps track of currently active and ending input points on the interactive
 * surface.
 *
 * @memberof westures-core
 *
 * @param {Element} element - The element underpinning the associated Region.
 */ class $17807945cdde5d67$var$$639be6fb478a6d5a$var$State {
    constructor(element){
        /**
     * Keep a reference to the element for the associated region.
     *
     * @type {Element}
     */ this.element = element;
        /**
     * Keeps track of the current Input objects.
     *
     * @alias [@@inputs]
     * @type {Map.<westures-core.Input>}
     * @memberof westure-core.State
     */ this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs] = new Map();
        /**
     * All currently valid inputs, including those that have ended.
     *
     * @type {westures-core.Input[]}
     */ this.inputs = [];
        /**
     * The array of currently active inputs, sourced from the current Input
     * objects. "Active" is defined as not being in the 'end' phase.
     *
     * @type {westures-core.Input[]}
     */ this.active = [];
        /**
     * The array of latest point data for the currently active inputs, sourced
     * from this.active.
     *
     * @type {westures-core.Point2D[]}
     */ this.activePoints = [];
        /**
     * The centroid of the currently active points.
     *
     * @type {westures-core.Point2D}
     */ this.centroid = {};
        /**
     * The latest event that the state processed.
     *
     * @type {Event}
     */ this.event = null;
    }
    /**
   * Deletes all inputs that are in the 'end' phase.
   */ clearEndedInputs() {
        this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].forEach((v, k)=>{
            if (v.phase === "end") this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].delete(k);
        });
    }
    /**
   * @param {string} phase - One of 'start', 'move', 'end', or 'cancel'.
   *
   * @return {westures-core.Input[]} Inputs in the given phase.
   */ getInputsInPhase(phase) {
        return this.inputs.filter((i)=>i.phase === phase);
    }
    /**
   * @param {string} phase - One of 'start', 'move', 'end', or 'cancel'.
   *
   * @return {westures-core.Input[]} Inputs <b>not</b> in the given phase.
   */ getInputsNotInPhase(phase) {
        return this.inputs.filter((i)=>i.phase !== phase);
    }
    /**
   * @return {boolean} True if there are no active inputs. False otherwise.
   */ hasNoInputs() {
        return this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].size === 0;
    }
    /**
   * Update the input with the given identifier using the given event.
   *
   * @private
   *
   * @param {Event} event - The event being captured.
   * @param {number} identifier - The identifier of the input to update.
   */ updateInput(event, identifier) {
        switch($17807945cdde5d67$var$$639be6fb478a6d5a$require$PHASE[event.type]){
            case $17807945cdde5d67$var$$639be6fb478a6d5a$require$START:
                this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].set(identifier, new $17807945cdde5d67$var$$e2125e2e71e37a0c$exports(event, identifier));
                try {
                    this.element.setPointerCapture(identifier);
                } catch (e) {
                // NOP: Optional operation failed.
                }
                break;
            // All of 'end', 'move', and 'cancel' perform updates, hence the
            // following fall-throughs
            case $17807945cdde5d67$var$$639be6fb478a6d5a$require$END:
                try {
                    this.element.releasePointerCapture(identifier);
                } catch (e1) {
                // NOP: Optional operation failed.
                }
            case $17807945cdde5d67$var$$639be6fb478a6d5a$require$CANCEL:
            case $17807945cdde5d67$var$$639be6fb478a6d5a$require$MOVE:
                if (this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].has(identifier)) this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].get(identifier).update(event);
                break;
            default:
                console.warn(`Unrecognized event type: ${event.type}`);
        }
    }
    /**
   * Updates the inputs with new information based upon a new event being fired.
   *
   * @private
   * @param {Event} event - The event being captured.
   */ updateAllInputs(event) {
        $17807945cdde5d67$var$$639be6fb478a6d5a$var$update_fns[event.constructor.name].call(this, event);
        this.updateFields(event);
    }
    /**
   * Updates the convenience fields.
   *
   * @private
   * @param {Event} event - Event with which to update the convenience fields.
   */ updateFields(event) {
        this.inputs = Array.from(this[$17807945cdde5d67$var$$639be6fb478a6d5a$var$symbols.inputs].values());
        this.active = this.getInputsNotInPhase("end");
        this.activePoints = this.active.map((i)=>i.current.point);
        this.centroid = $17807945cdde5d67$var$$6c3676f10a43b740$exports.centroid(this.activePoints);
        this.event = event;
    }
}
$17807945cdde5d67$var$$639be6fb478a6d5a$exports = $17807945cdde5d67$var$$639be6fb478a6d5a$var$State;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$CANCEL_EVENTS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.CANCEL_EVENTS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$KEYBOARD_EVENTS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.KEYBOARD_EVENTS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$MOUSE_EVENTS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.MOUSE_EVENTS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$POINTER_EVENTS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.POINTER_EVENTS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$TOUCH_EVENTS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.TOUCH_EVENTS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$STATE_KEY_STRINGS = $17807945cdde5d67$var$$be6f0e84320366a7$exports.STATE_KEY_STRINGS;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$PHASE = $17807945cdde5d67$var$$be6f0e84320366a7$exports.PHASE;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$CANCEL = $17807945cdde5d67$var$$be6f0e84320366a7$exports.CANCEL;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$END = $17807945cdde5d67$var$$be6f0e84320366a7$exports.END;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$START = $17807945cdde5d67$var$$be6f0e84320366a7$exports.START;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setDifference = $17807945cdde5d67$var$$4559ecf940edc78d$exports.setDifference;
var $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setFilter = $17807945cdde5d67$var$$4559ecf940edc78d$exports.setFilter;
/**
 * Allows the user to specify the control region which will listen for user
 * input events.
 *
 * @memberof westures-core
 *
 * @param {Element} element=window - The element which should listen to input
 * events.
 * @param {object} [options]
 * @param {boolean} [options.capture=false] - Whether the region uses the
 * capture phase of input events. If false, uses the bubbling phase.
 * @param {boolean} [options.preferPointer=true] - If false, the region listens
 * to mouse/touch events instead of pointer events.
 * @param {boolean} [options.preventDefault=true] - Whether the default
 * browser functionality should be disabled. This option should most likely be
 * ignored. Here there by dragons if set to false.
 * @param {string} [options.touchAction='none'] - Value to set the CSS
 * 'touch-action' property to on elements added to the region.
 */ class $17807945cdde5d67$var$$b66a0f22c18e3e3d$var$Region {
    constructor(element = window, options = {}){
        options = {
            ...$17807945cdde5d67$var$$b66a0f22c18e3e3d$var$Region.DEFAULTS,
            ...options
        };
        /**
     * The list of relations between elements, their gestures, and the handlers.
     *
     * @type {Set.<westures-core.Gesture>}
     */ this.gestures = new Set();
        /**
     * The list of active gestures for the current input session.
     *
     * @type {Set.<westures-core.Gesture>}
     */ this.activeGestures = new Set();
        /**
     * The base list of potentially active gestures for the current input
     * session.
     *
     * @type {Set.<westures-core.Gesture>}
     */ this.potentialGestures = new Set();
        /**
     * The element being bound to.
     *
     * @type {Element}
     */ this.element = element;
        /**
     * The user-supplied options for the Region.
     *
     * @type {object}
     */ this.options = options;
        /**
     * The internal state object for a Region.  Keeps track of inputs.
     *
     * @type {westures-core.State}
     */ this.state = new $17807945cdde5d67$var$$639be6fb478a6d5a$exports(this.element);
        // Begin operating immediately.
        this.activate();
    }
    /**
   * Activates the region by adding event listeners for all appropriate input
   * events to the region's element.
   *
   * @private
   */ activate() {
        /*
     * Listening to both mouse and touch comes with the difficulty that
     * preventDefault() must be called to prevent both events from iterating
     * through the system. However I have left it as an option to the end user,
     * which defaults to calling preventDefault(), in case there's a use-case I
     * haven't considered or am not aware of.
     *
     * It also may be a good idea to keep regions small in large pages.
     *
     * See:
     *  https://www.html5rocks.com/en/mobile/touchandmouse/
     *  https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
     *  https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
     */ let eventNames = [];
        if (this.options.preferPointer && window.PointerEvent) eventNames = $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$POINTER_EVENTS;
        else eventNames = $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$MOUSE_EVENTS.concat($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$TOUCH_EVENTS);
        // Bind detected browser events to the region element.
        const arbitrate = this.arbitrate.bind(this);
        eventNames.forEach((eventName)=>{
            this.element.addEventListener(eventName, arbitrate, {
                capture: this.options.capture,
                once: false,
                passive: false
            });
        });
        const cancel = this.cancel.bind(this);
        $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$CANCEL_EVENTS.forEach((eventName)=>{
            window.addEventListener(eventName, cancel);
        });
        const handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
        $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$KEYBOARD_EVENTS.forEach((eventName)=>{
            window.addEventListener(eventName, handleKeyboardEvent);
        });
    }
    /**
   * Handles a cancel event. Resets the state and the active / potential gesture
   * lists.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   */ cancel(event) {
        if (this.options.preventDefault) event.preventDefault();
        this.state.inputs.forEach((input)=>{
            input.update(event);
        });
        this.activeGestures.forEach((gesture)=>{
            gesture.evaluateHook($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$CANCEL, this.state);
        });
        this.state = new $17807945cdde5d67$var$$639be6fb478a6d5a$exports(this.element);
        this.resetActiveGestures();
    }
    /**
   * Handles a keyboard event, triggering a restart of any gestures that need
   * it.
   *
   * @private
   * @param {KeyboardEvent} event - The keyboard event.
   */ handleKeyboardEvent(event) {
        if ($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$STATE_KEY_STRINGS.indexOf(event.key) >= 0) {
            this.state.event = event;
            const oldActiveGestures = this.activeGestures;
            this.setActiveGestures();
            $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setDifference(oldActiveGestures, this.activeGestures).forEach((gesture)=>{
                gesture.evaluateHook($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$END, this.state);
            });
            $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setDifference(this.activeGestures, oldActiveGestures).forEach((gesture)=>{
                gesture.evaluateHook($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$START, this.state);
            });
        }
    }
    /**
   * Resets the active gestures.
   *
   * @private
   */ resetActiveGestures() {
        this.potentialGestures = new Set();
        this.activeGestures = new Set();
    }
    /**
   * Selects active gestures from the list of potentially active gestures.
   *
   * @private
   */ setActiveGestures() {
        this.activeGestures = $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setFilter(this.potentialGestures, (gesture)=>{
            return gesture.isEnabled(this.state);
        });
    }
    /**
   * Selects the potentially active gestures.
   *
   * @private
   */ setPotentialGestures() {
        const input = this.state.inputs[0];
        this.potentialGestures = $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setFilter(this.gestures, (gesture)=>{
            return input.initialElements.has(gesture.element);
        });
    }
    /**
   * Selects the gestures that are active for the current input sequence.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   * @param {boolean} isInitial - Whether this is an initial contact.
   */ updateActiveGestures(event, isInitial) {
        if ($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$PHASE[event.type] === $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$START) {
            if (isInitial) this.setPotentialGestures();
            this.setActiveGestures();
        }
    }
    /**
   * Evaluates whether the current input session has completed.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   */ pruneActiveGestures(event) {
        if ($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$PHASE[event.type] === $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$END) {
            if (this.state.hasNoInputs()) this.resetActiveGestures();
            else this.setActiveGestures();
        }
    }
    /**
   * All input events flow through this function. It makes sure that the input
   * state is maintained, determines which gestures to analyze based on the
   * initial position of the inputs, calls the relevant gesture hooks, and
   * dispatches gesture data.
   *
   * @private
   * @param {Event} event - The event emitted from the window object.
   */ arbitrate(event) {
        const isInitial = this.state.hasNoInputs();
        this.state.updateAllInputs(event);
        this.updateActiveGestures(event, isInitial);
        if (this.activeGestures.size > 0) {
            if (this.options.preventDefault) event.preventDefault();
            this.activeGestures.forEach((gesture)=>{
                gesture.evaluateHook($17807945cdde5d67$var$$b66a0f22c18e3e3d$require$PHASE[event.type], this.state);
            });
        }
        this.state.clearEndedInputs();
        this.pruneActiveGestures(event);
    }
    /**
   * Adds the given gesture to the region.
   *
   * @param {westures-core.Gesture} gesture - Instantiated gesture to add.
   */ addGesture(gesture) {
        gesture.element.style.touchAction = this.options.touchAction;
        this.gestures.add(gesture);
    }
    /**
   * Removes the given gesture from the region.
   *
   * @param {westures-core.Gesture} gesture - Instantiated gesture to add.
   */ removeGesture(gesture) {
        this.gestures.delete(gesture);
        this.potentialGestures.delete(gesture);
        this.activeGestures.delete(gesture);
    }
    /**
   * Retrieves Gestures by their associated element.
   *
   * @param {Element} element - The element for which to find gestures.
   *
   * @return {westures-core.Gesture[]} Gestures to which the element is bound.
   */ getGesturesByElement(element) {
        return $17807945cdde5d67$var$$b66a0f22c18e3e3d$require$setFilter(this.gestures, (gesture)=>gesture.element === element);
    }
    /**
   * Remove all gestures bound to the given element.
   *
   * @param {Element} element - The element to unbind.
   */ removeGesturesByElement(element) {
        this.getGesturesByElement(element).forEach((g)=>this.removeGesture(g));
    }
}
$17807945cdde5d67$var$$b66a0f22c18e3e3d$var$Region.DEFAULTS = {
    capture: false,
    preferPointer: true,
    preventDefault: true,
    touchAction: "none"
};
$17807945cdde5d67$var$$b66a0f22c18e3e3d$exports = $17807945cdde5d67$var$$b66a0f22c18e3e3d$var$Region;
var $17807945cdde5d67$var$$01c3d7b128023e4f$exports = {};
"use strict";
const $17807945cdde5d67$var$$01c3d7b128023e4f$var$cascade = Symbol("cascade");
const $17807945cdde5d67$var$$01c3d7b128023e4f$var$smooth = Symbol("smooth");
/**
 * Determines whether to apply smoothing. Smoothing is on by default but turned
 * off if either:<br>
 *  1. The user explicitly requests that it be turned off.<br>
 *  2. The active pointer is not "coarse".<br>
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia}
 *
 * @inner
 * @memberof westures-core.Smoothable
 *
 * @param {boolean} isRequested - Whether smoothing was requested by the user.
 *
 * @returns {boolean} Whether to apply smoothing.
 */ function $17807945cdde5d67$var$$01c3d7b128023e4f$var$smoothingIsApplicable(isRequested) {
    if (isRequested) try {
        return window.matchMedia("(pointer: coarse)").matches;
    } catch (e) {
        return true;
    }
    return false;
}
/**
 * A Smoothable datatype is one that is capable of smoothing out a series of
 * values as they come in, one at a time, providing a more consistent series. It
 * does this by creating some inertia in the values using a cascading average.
 * (For those who are interested in such things, this effectively means that it
 * provides a practical application of Zeno's Dichotomy).
 *
 * @example
 * const x = new Smoothable({ identity: 1 });
 * const a = x.next(1);   // 1.0
 * const b = x.next(1.2); // 1.1
 * const c = x.next(0.9); // 1.0
 * const d = x.next(0.6); // 0.8
 * const e = x.next(1.2); // 1.0
 * const f = x.next(1.6); // 1.3
 * x.restart();
 * const g = x.next(0);   // 0.5
 *
 * @memberof westures-core
 *
 * @param {Object} [options]
 * @param {boolean} [options.applySmoothing=true] Whether to apply smoothing to
 * the data.
 * @param {*} [options.identity=0] The identity value of this smoothable data.
 */ class $17807945cdde5d67$var$$01c3d7b128023e4f$var$Smoothable {
    constructor(options = {}){
        const final_options = {
            ...$17807945cdde5d67$var$$01c3d7b128023e4f$var$Smoothable.DEFAULTS,
            ...options
        };
        /**
     * The function through which smoothed emits are passed.
     *
     * @method
     * @param {*} data - The data to emit.
     *
     * @return {*} The smoothed out data.
     */ this.next = null;
        if ($17807945cdde5d67$var$$01c3d7b128023e4f$var$smoothingIsApplicable(final_options.applySmoothing)) this.next = this[$17807945cdde5d67$var$$01c3d7b128023e4f$var$smooth].bind(this);
        else this.next = (data)=>data;
        /**
     * The "identity" value of the data that will be smoothed.
     *
     * @type {*}
     * @default 0
     */ this.identity = final_options.identity;
        /**
     * The cascading average of outgoing values.
     *
     * @memberof westures-core.Smoothable
     * @alias [@@cascade]
     * @type {object}
     */ this[$17807945cdde5d67$var$$01c3d7b128023e4f$var$cascade] = this.identity;
    }
    /**
   * Restart the Smoothable gesture.
   */ restart() {
        this[$17807945cdde5d67$var$$01c3d7b128023e4f$var$cascade] = this.identity;
    }
    /**
   * Smooth out the outgoing data.
   *
   * @memberof westures-core.Smoothable
   * @alias [@@smooth]
   * @param {object} data - The next batch of data to emit.
   *
   * @return {?object}
   */ [$17807945cdde5d67$var$$01c3d7b128023e4f$var$smooth](data) {
        const average = this.average(this[$17807945cdde5d67$var$$01c3d7b128023e4f$var$cascade], data);
        this[$17807945cdde5d67$var$$01c3d7b128023e4f$var$cascade] = average;
        return average;
    }
    /**
   * Average out two values, as part of the smoothing algorithm. Override this
   * method if the data being smoothed is not a Number.
   *
   * @param {number} a
   * @param {number} b
   *
   * @return {number} The average of 'a' and 'b'
   */ average(a, b) {
        return (a + b) / 2;
    }
}
$17807945cdde5d67$var$$01c3d7b128023e4f$var$Smoothable.DEFAULTS = {
    applySmoothing: true,
    identity: 0
};
$17807945cdde5d67$var$$01c3d7b128023e4f$exports = $17807945cdde5d67$var$$01c3d7b128023e4f$var$Smoothable;
$17807945cdde5d67$exports = {
    Gesture: $17807945cdde5d67$var$$de0d6a332419bf3c$exports,
    Input: $17807945cdde5d67$var$$e2125e2e71e37a0c$exports,
    Point2D: $17807945cdde5d67$var$$6c3676f10a43b740$exports,
    PointerData: $17807945cdde5d67$var$$0ca7bfe1c074e8ca$exports,
    Region: $17807945cdde5d67$var$$b66a0f22c18e3e3d$exports,
    Smoothable: $17807945cdde5d67$var$$01c3d7b128023e4f$exports,
    State: $17807945cdde5d67$var$$639be6fb478a6d5a$exports,
    ...$17807945cdde5d67$var$$be6f0e84320366a7$exports,
    ...$17807945cdde5d67$var$$4559ecf940edc78d$exports
};


var $edded22326d64913$exports = {};
/*
 * Contains the Pan class.
 */ "use strict";

var $edded22326d64913$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $edded22326d64913$require$Point2D = $17807945cdde5d67$exports.Point2D;
var $edded22326d64913$require$Smoothable = $17807945cdde5d67$exports.Smoothable;
/**
 * Data returned when a Pan is recognized.
 *
 * @typedef {Object} PanData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures-core.Point2D} translation - The change vector from the
 * last emit.
 *
 * @memberof ReturnTypes
 */ /**
 * A Pan is defined as a normal movement in any direction.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PanData}
 * @see {westures-core.Smoothable}
 * @memberof westures
 *
 * @param {Element} element - The element with which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 */ class $edded22326d64913$var$Pan extends $edded22326d64913$require$Gesture {
    constructor(element, handler, options = {}){
        super("pan", element, handler, options);
        /**
     * The previous point location.
     *
     * @type {westures-core.Point2D}
     */ this.previous = null;
        /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<westures-core.Point2D>}
     */ this.outgoing = new $edded22326d64913$require$Smoothable({
            ...options,
            identity: new $edded22326d64913$require$Point2D()
        });
        this.outgoing.average = (a, b)=>$edded22326d64913$require$Point2D.centroid([
                a,
                b
            ]);
    }
    /**
   * Resets the gesture's progress by saving the current centroid of the active
   * inputs. To be called whenever the number of inputs changes.
   *
   * @param {State} state
   */ restart(state) {
        this.previous = state.centroid;
        this.outgoing.restart();
    }
    start(state) {
        this.restart(state);
    }
    move(state) {
        const translation = state.centroid.minus(this.previous);
        this.previous = state.centroid;
        return {
            translation: this.outgoing.next(translation)
        };
    }
    end(state) {
        this.restart(state);
    }
    cancel(state) {
        this.restart(state);
    }
}
$edded22326d64913$exports = $edded22326d64913$var$Pan;


var $a29eb49c9650e38a$exports = {};
/*
 * Contains the abstract Pinch class.
 */ "use strict";

var $a29eb49c9650e38a$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $a29eb49c9650e38a$require$Smoothable = $17807945cdde5d67$exports.Smoothable;
/**
 * Data returned when a Pinch is recognized.
 *
 * @typedef {Object} PinchData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 *    the centroid.
 * @property {number} scale - The proportional change in distance since last
 * emit.
 *
 * @memberof ReturnTypes
 */ /**
 * A Pinch is defined as two or more inputs moving either together or apart.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PinchData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=2] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 */ class $a29eb49c9650e38a$var$Pinch extends $a29eb49c9650e38a$require$Gesture {
    constructor(element, handler, options = {}){
        options = {
            ...$a29eb49c9650e38a$var$Pinch.DEFAULTS,
            ...options
        };
        super("pinch", element, handler, options);
        /**
     * The previous distance.
     *
     * @type {number}
     */ this.previous = 0;
        /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */ this.outgoing = new $a29eb49c9650e38a$require$Smoothable({
            ...options,
            identity: 1
        });
    }
    /**
   * Initializes the gesture progress.
   *
   * @param {State} state - current input state.
   */ restart(state) {
        this.previous = state.centroid.averageDistanceTo(state.activePoints);
        this.outgoing.restart();
    }
    start(state) {
        this.restart(state);
    }
    move(state) {
        const distance = state.centroid.averageDistanceTo(state.activePoints);
        const scale = distance / this.previous;
        this.previous = distance;
        return {
            distance: distance,
            scale: this.outgoing.next(scale)
        };
    }
    end(state) {
        this.restart(state);
    }
    cancel(state) {
        this.restart(state);
    }
}
$a29eb49c9650e38a$var$Pinch.DEFAULTS = Object.freeze({
    minInputs: 2
});
$a29eb49c9650e38a$exports = $a29eb49c9650e38a$var$Pinch;


var $044241a6e313bbcb$exports = {};
/*
 * Contains the Press class.
 */ "use strict";

var $044241a6e313bbcb$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $044241a6e313bbcb$require$Point2D = $17807945cdde5d67$exports.Point2D;
var $044241a6e313bbcb$require$MOVE = $17807945cdde5d67$exports.MOVE;
/**
 * Data returned when a Press is recognized.
 *
 * @typedef {Object} PressData
 *
 * @property {westures-core.Point2D} centroid - The current centroid of the
 * input points.
 * @property {westures-core.Point2D} initial - The initial centroid of the input
 * points.
 * @property {number} distance - The total movement since initial contact.
 *
 * @memberof ReturnTypes
 */ /**
 * A Press is defined as one or more input points being held down without
 * moving. Press gestures may be stacked by pressing with additional pointers
 * beyond the minimum, so long as none of the points move or are lifted, a Press
 * will be recognized for each additional pointer.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PressData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {number} [options.delay=1000] - The delay before emitting, during
 * which time the number of inputs must not go below minInputs.
 * @param {number} [options.tolerance=10] - The tolerance in pixels a user can
 * move and still allow the gesture to emit.
 */ class $044241a6e313bbcb$var$Press extends $044241a6e313bbcb$require$Gesture {
    constructor(element, handler, options = {}){
        super("press", element, handler, {
            ...$044241a6e313bbcb$var$Press.DEFAULTS,
            ...options
        });
    }
    start(state) {
        const initial = state.centroid;
        const originalInputs = Array.from(state.active);
        setTimeout(()=>{
            const inputs = state.active.filter((i)=>originalInputs.includes(i));
            if (inputs.length === originalInputs.length) {
                const centroid = $044241a6e313bbcb$require$Point2D.centroid(inputs.map((i)=>i.current.point));
                const distance = initial.distanceTo(centroid);
                if (distance <= this.options.tolerance) this.recognize($044241a6e313bbcb$require$MOVE, state, {
                    centroid: centroid,
                    distance: distance,
                    initial: initial
                });
            }
        }, this.options.delay);
    }
}
$044241a6e313bbcb$var$Press.DEFAULTS = Object.freeze({
    delay: 1000,
    tolerance: 10
});
$044241a6e313bbcb$exports = $044241a6e313bbcb$var$Press;


var $b6747a8030ff7e4d$exports = {};
/*
 * Contains the abstract Pull class.
 */ "use strict";

var $b6747a8030ff7e4d$require$Smoothable = $17807945cdde5d67$exports.Smoothable;
var $5618dc3399c82d06$exports = {};
/*
 * Contains the Rotate class.
 */ "use strict";

var $5618dc3399c82d06$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $5618dc3399c82d06$require$Point2D = $17807945cdde5d67$exports.Point2D;
var $5618dc3399c82d06$require$Smoothable = $17807945cdde5d67$exports.Smoothable;
/**
 * Data returned when a Pivotable is recognized.
 *
 * @typedef {Object} SwivelData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 * @property {westures-core.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */ /**
 * A Pivotable is a single input rotating around a fixed point. The fixed point
 * is determined by the input's location at its 'start' phase.
 *
 * @extends westures.Gesture
 * @see {ReturnTypes.SwivelData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {Element} [options.dynamicPivot=false] - Normally the center point of
 * the gesture's element is used as the pivot. If this option is set, the
 * initial contact point with the element is used as the pivot instead.
 */ class $5618dc3399c82d06$var$Pivotable extends $5618dc3399c82d06$require$Gesture {
    constructor(type = "pivotable", element, handler, options = {}){
        super(type, element, handler, {
            ...$5618dc3399c82d06$var$Pivotable.DEFAULTS,
            ...options
        });
        /**
     * The pivot point of the pivotable.
     *
     * @type {westures-core.Point2D}
     */ this.pivot = null;
        /**
     * The previous data.
     *
     * @type {number}
     */ this.previous = 0;
        /**
     * The outgoing data.
     *
     * @type {westures-core.Smoothable}
     */ this.outgoing = new $5618dc3399c82d06$require$Smoothable(options);
    }
    /**
   * Determine the center point of the given element's bounding client
   * rectangle.
   *
   * @static
   *
   * @param {Element} element - The DOM element to analyze.
   * @return {westures-core.Point2D} - The center of the element's bounding
   * client rectangle.
   */ static getClientCenter(element) {
        const rect = element.getBoundingClientRect();
        return new $5618dc3399c82d06$require$Point2D(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    /**
   * Updates the previous data. It will be called during the 'start' and 'end'
   * phases, and should also be called during the 'move' phase implemented by
   * the subclass.
   *
   * @abstract
   * @param {State} state - the current input state.
   */ updatePrevious() {
        throw "Gestures which extend Pivotable must implement updatePrevious()";
    }
    /**
   * Restart the given progress object using the given input object.
   *
   * @param {State} state - current input state.
   */ restart(state) {
        if (this.options.dynamicPivot) {
            this.pivot = state.centroid;
            this.previous = 0;
        } else {
            this.pivot = $5618dc3399c82d06$var$Pivotable.getClientCenter(this.element);
            this.updatePrevious(state);
        }
        this.outgoing.restart();
    }
    start(state) {
        this.restart(state);
    }
    end(state) {
        if (state.active.length > 0) this.restart(state);
        else this.outgoing.restart();
    }
    cancel() {
        this.outgoing.restart();
    }
}
$5618dc3399c82d06$var$Pivotable.DEFAULTS = Object.freeze({
    deadzoneRadius: 15,
    dynamicPivot: false
});
$5618dc3399c82d06$exports = $5618dc3399c82d06$var$Pivotable;


/**
 * Data returned when a Pull is recognized.
 *
 * @typedef {Object} PullData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} distance - The average distance from an active input to
 * the centroid.
 * @property {number} scale - The proportional change in distance since last
 * emit.
 * @property {westures-core.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */ /**
 * A Pull is defined as a single input moving away from or towards a pivot
 * point.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.PullData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {Element} [options.dynamicPivot=false] - Normally the center point of
 * the gesture's element is used as the pivot. If this option is set, the
 * initial contact point with the element is used as the pivot instead.
 */ class $b6747a8030ff7e4d$var$Pull extends $5618dc3399c82d06$exports {
    constructor(element, handler, options = {}){
        super("pull", element, handler, options);
        /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */ this.outgoing = new $b6747a8030ff7e4d$require$Smoothable({
            ...options,
            identity: 1
        });
    }
    updatePrevious(state) {
        this.previous = this.pivot.distanceTo(state.centroid);
    }
    move(state) {
        const pivot = this.pivot;
        const distance = pivot.distanceTo(state.centroid);
        const scale = distance / this.previous;
        const { deadzoneRadius: deadzoneRadius  } = this.options;
        let rv = null;
        if (distance > deadzoneRadius && this.previous > deadzoneRadius) rv = {
            distance: distance,
            scale: this.outgoing.next(scale),
            pivot: pivot
        };
        /*
     * Updating the previous distance regardless of emit prevents sudden changes
     * when the user exits the deadzone circle.
     */ this.previous = distance;
        return rv;
    }
}
$b6747a8030ff7e4d$exports = $b6747a8030ff7e4d$var$Pull;


var $2779699df4dafe8f$exports = {};
/*
 * Contains the Rotate class.
 */ "use strict";

var $2779699df4dafe8f$require$angularDifference = $17807945cdde5d67$exports.angularDifference;
var $2779699df4dafe8f$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $2779699df4dafe8f$require$Smoothable = $17807945cdde5d67$exports.Smoothable;
/**
 * Data returned when a Rotate is recognized.
 *
 * @typedef {Object} RotateData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 *
 * @memberof ReturnTypes
 */ /**
 * A Rotate is defined as two inputs moving with a changing angle between them.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.RotateData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=2] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 */ class $2779699df4dafe8f$var$Rotate extends $2779699df4dafe8f$require$Gesture {
    constructor(element, handler, options = {}){
        options = {
            ...$2779699df4dafe8f$var$Rotate.DEFAULTS,
            ...options
        };
        super("rotate", element, handler, options);
        /**
     * Track the previous angles for each input.
     *
     * @type {number[]}
     */ this.previousAngles = [];
        /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */ this.outgoing = new $2779699df4dafe8f$require$Smoothable(options);
    }
    /**
   * Restart the gesture for a new number of inputs.
   *
   * @param {State} state - current input state.
   */ restart(state) {
        this.previousAngles = state.centroid.anglesTo(state.activePoints);
        this.outgoing.restart();
    }
    start(state) {
        this.restart(state);
    }
    move(state) {
        const stagedAngles = state.centroid.anglesTo(state.activePoints);
        const angle = stagedAngles.reduce((total, current, index)=>{
            return total + $2779699df4dafe8f$require$angularDifference(current, this.previousAngles[index]);
        }, 0);
        this.previousAngles = stagedAngles;
        const rotation = angle / state.activePoints.length;
        return {
            rotation: this.outgoing.next(rotation)
        };
    }
    end(state) {
        this.restart(state);
    }
    cancel() {
        this.outgoing.restart();
    }
}
$2779699df4dafe8f$var$Rotate.DEFAULTS = Object.freeze({
    minInputs: 2
});
$2779699df4dafe8f$exports = $2779699df4dafe8f$var$Rotate;


var $29f6d3783b0fe128$exports = {};
/*
 * Contains the Swipe class.
 */ "use strict";

var $29f6d3783b0fe128$require$Gesture = $17807945cdde5d67$exports.Gesture;
const $29f6d3783b0fe128$var$PROGRESS_STACK_SIZE = 7;
const $29f6d3783b0fe128$var$MS_THRESHOLD = 300;
/**
 * Data returned when a Swipe is recognized.
 *
 * @typedef {Object} SwipeData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} velocity - The velocity of the swipe.
 * @property {number} direction - In radians, the direction of the swipe.
 * @property {westures-core.Point2D} point - The point at which the swipe ended.
 * @property {number} time - The epoch time, in ms, when the swipe ended.
 *
 * @memberof ReturnTypes
 */ /**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.SwipeData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 */ class $29f6d3783b0fe128$var$Swipe extends $29f6d3783b0fe128$require$Gesture {
    constructor(element, handler, options = {}){
        super("swipe", element, handler, options);
        /**
     * Moves list.
     *
     * @type {object[]}
     */ this.moves = [];
        /**
     * Data to emit when all points have ended.
     *
     * @type {ReturnTypes.SwipeData}
     */ this.saved = null;
    }
    /**
   * Restart the swipe state for a new numper of inputs.
   */ restart() {
        this.moves = [];
        this.saved = null;
    }
    start() {
        this.restart();
    }
    move(state) {
        this.moves.push({
            time: Date.now(),
            point: state.centroid
        });
        if (this.moves.length > $29f6d3783b0fe128$var$PROGRESS_STACK_SIZE) this.moves.splice(0, this.moves.length - $29f6d3783b0fe128$var$PROGRESS_STACK_SIZE);
    }
    end(state) {
        const result = this.getResult();
        this.moves = [];
        if (state.active.length > 0) {
            this.saved = result;
            return null;
        }
        this.saved = null;
        return $29f6d3783b0fe128$var$Swipe.validate(result);
    }
    cancel() {
        this.restart();
    }
    /**
   * Get the swipe result.
   *
   * @returns {?ReturnTypes.SwipeData}
   */ getResult() {
        if (this.moves.length < $29f6d3783b0fe128$var$PROGRESS_STACK_SIZE) return this.saved;
        const vlim = $29f6d3783b0fe128$var$PROGRESS_STACK_SIZE - 1;
        const { point: point , time: time  } = this.moves[vlim];
        const velocity = $29f6d3783b0fe128$var$Swipe.calc_velocity(this.moves, vlim);
        const direction = $29f6d3783b0fe128$var$Swipe.calc_angle(this.moves, vlim);
        const centroid = point;
        return {
            point: point,
            velocity: velocity,
            direction: direction,
            time: time,
            centroid: centroid
        };
    }
    /**
   * Validates that an emit should occur with the given data.
   *
   * @static
   * @param {?ReturnTypes.SwipeData} data
   * @returns {?ReturnTypes.SwipeData}
   */ static validate(data) {
        if (data == null) return null;
        return Date.now() - data.time > $29f6d3783b0fe128$var$MS_THRESHOLD ? null : data;
    }
    /**
   * Calculates the angle of movement along a series of moves.
   *
   * @static
   * @see {@link https://en.wikipedia.org/wiki/Mean_of_circular_quantities}
   *
   * @param {{time: number, point: westures-core.Point2D}} moves - The moves
   * list to process.
   * @param {number} vlim - The number of moves to process.
   *
   * @return {number} The angle of the movement.
   */ static calc_angle(moves, vlim) {
        const point = moves[vlim].point;
        let sin = 0;
        let cos = 0;
        for(let i = 0; i < vlim; ++i){
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
   * @static
   * @param {object} start
   * @param {westures-core.Point2D} start.point
   * @param {number} start.time
   * @param {object} end
   * @param {westures-core.Point2D} end.point
   * @param {number} end.time
   *
   * @return {number} velocity from start to end point.
   */ static velocity(start, end) {
        const distance = end.point.distanceTo(start.point);
        const time = end.time - start.time + 1;
        return distance / time;
    }
    /**
   * Calculates the veloctiy of movement through a series of moves.
   *
   * @static
   * @param {{time: number, point: westures-core.Point2D}} moves - The moves
   * list to process.
   * @param {number} vlim - The number of moves to process.
   *
   * @return {number} The velocity of the moves.
   */ static calc_velocity(moves, vlim) {
        let max = 0;
        for(let i = 0; i < vlim; ++i){
            const current = $29f6d3783b0fe128$var$Swipe.velocity(moves[i], moves[i + 1]);
            if (current > max) max = current;
        }
        return max;
    }
}
$29f6d3783b0fe128$exports = $29f6d3783b0fe128$var$Swipe;


var $5bf1e923ca9fec67$exports = {};
/*
 * Contains the Rotate class.
 */ "use strict";

var $5bf1e923ca9fec67$require$angularDifference = $17807945cdde5d67$exports.angularDifference;
var $5bf1e923ca9fec67$require$Smoothable = $17807945cdde5d67$exports.Smoothable;

/**
 * Data returned when a Swivel is recognized.
 *
 * @typedef {Object} SwivelData
 * @mixes ReturnTypes.BaseData
 *
 * @property {number} rotation - In radians, the change in angle since last
 * emit.
 * @property {westures-core.Point2D} pivot - The pivot point.
 *
 * @memberof ReturnTypes
 */ /**
 * A Swivel is a single input rotating around a fixed point. The fixed point is
 * determined by the input's location at its 'start' phase.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.SwivelData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {boolean} [options.applySmoothing=true] - Whether to apply inertial
 * smoothing for systems with coarse pointers.
 * @param {number} [options.deadzoneRadius=15] - The radius in pixels around the
 * start point in which to do nothing.
 * @param {Element} [options.dynamicPivot=false] - Normally the center point of
 * the gesture's element is used as the pivot. If this option is set, the
 * initial contact point with the element is used as the pivot instead.
 */ class $5bf1e923ca9fec67$var$Swivel extends $5618dc3399c82d06$exports {
    constructor(element, handler, options = {}){
        super("swivel", element, handler, options);
        /*
     * The outgoing data, with optional inertial smoothing.
     *
     * @override
     * @type {westures-core.Smoothable<number>}
     */ this.outgoing = new $5bf1e923ca9fec67$require$Smoothable(options);
    }
    updatePrevious(state) {
        this.previous = this.pivot.angleTo(state.centroid);
    }
    move(state) {
        const pivot = this.pivot;
        const angle = pivot.angleTo(state.centroid);
        const rotation = $5bf1e923ca9fec67$require$angularDifference(angle, this.previous);
        let rv = null;
        if (pivot.distanceTo(state.centroid) > this.options.deadzoneRadius) rv = {
            rotation: this.outgoing.next(rotation),
            pivot: pivot
        };
        /*
     * Updating the previous angle regardless of emit prevents sudden flips when
     * the user exits the deadzone circle.
     */ this.previous = angle;
        return rv;
    }
}
$5bf1e923ca9fec67$exports = $5bf1e923ca9fec67$var$Swivel;


var $2f0219f585763ab0$exports = {};
/*
 * Contains the Tap class.
 */ "use strict";

var $2f0219f585763ab0$require$Gesture = $17807945cdde5d67$exports.Gesture;
var $2f0219f585763ab0$require$Point2D = $17807945cdde5d67$exports.Point2D;
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
 */ /**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.TapData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {number} [options.minDelay=0] - The minimum delay between a touchstart
 * and touchend can be configured in milliseconds.
 * @param {number} [options.maxDelay=300] - The maximum delay between a
 * touchstart and touchend can be configured in milliseconds.
 * @param {number} [options.maxRetain=300] - The maximum time after a tap ends
 * before it is discarded can be configured in milliseconds. Useful for
 * multi-tap gestures, to allow things like slow "double clicks".
 * @param {number} [options.numTaps=1] - Number of taps to require.
 * @param {number} [options.tolerance=10] - The tolerance in pixels an input can
 * move before it will no longer be considered part of a tap.
 */ class $2f0219f585763ab0$var$Tap extends $2f0219f585763ab0$require$Gesture {
    constructor(element, handler, options = {}){
        super("tap", element, handler, {
            ...$2f0219f585763ab0$var$Tap.DEFAULTS,
            ...options
        });
        /**
     * An array of inputs that have ended recently.
     *
     * @type {Input[]}
     */ this.taps = [];
    }
    end(state) {
        const now = Date.now();
        const { minDelay: minDelay , maxDelay: maxDelay , maxRetain: maxRetain , numTaps: numTaps , tolerance: tolerance  } = this.options;
        // Save the recently ended inputs as taps.
        this.taps = this.taps.concat(state.getInputsInPhase("end")).filter((input)=>{
            const elapsed = input.elapsedTime;
            const tdiff = now - input.current.time;
            return elapsed <= maxDelay && elapsed >= minDelay && tdiff <= maxRetain;
        });
        // Validate the list of taps.
        if (this.taps.length !== numTaps || this.taps.some((i)=>i.totalDistance() > tolerance)) return null;
        const centroid = $2f0219f585763ab0$require$Point2D.centroid(this.taps.map((i)=>i.current.point));
        this.taps = []; // Critical! Used taps need to be cleared!
        return {
            centroid: centroid,
            ...centroid
        };
    }
}
$2f0219f585763ab0$var$Tap.DEFAULTS = Object.freeze({
    minDelay: 0,
    maxDelay: 300,
    maxRetain: 300,
    numTaps: 1,
    tolerance: 10
});
$2f0219f585763ab0$exports = $2f0219f585763ab0$var$Tap;


var $13a50dd07826f9eb$exports = {};
/*
 * Contains the Track class.
 */ "use strict";

var $13a50dd07826f9eb$require$Gesture = $17807945cdde5d67$exports.Gesture;
/**
 * Data returned when a Track is recognized.
 *
 * @typedef {Object} TrackData
 * @mixes ReturnTypes.BaseData
 *
 * @property {westures-core.Point2D[]} active - Points currently in 'start' or
 *    'move' phase.
 *
 * @memberof ReturnTypes
 */ /**
 * A Track gesture forwards a list of active points and their centroid on each
 * of the selected phases.
 *
 * @extends westures-core.Gesture
 * @see {ReturnTypes.TrackData}
 * @memberof westures
 *
 * @param {Element} element - The element to which to associate the gesture.
 * @param {Function} handler - The function handler to execute when a gesture
 * is recognized on the associated element.
 * @param {object} [options] - Gesture customization options.
 * @param {westures-core.STATE_KEYS[]} [options.enableKeys=[]] - List of keys
 * which will enable the gesture. The gesture will not be recognized unless one
 * of these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the enable key is always down.
 * @param {westures-core.STATE_KEYS[]} [options.disableKeys=[]] - List of keys
 * which will disable the gesture. The gesture will not be recognized if one of
 * these keys is pressed while the interaction occurs. If not specified or an
 * empty list, the gesture is treated as though the disable key is never down.
 * @param {number} [options.minInputs=1] - The minimum number of pointers that
 * must be active for the gesture to be recognized. Uses >=.
 * @param {number} [options.maxInputs=Number.MAX_VALUE] - The maximum number of
 * pointers that may be active for the gesture to be recognized. Uses <=.
 * @param {string[]} [options.phases=[]] Phases to recognize. Entries can be any
 * or all of 'start', 'move', 'end', and 'cancel'.
 */ class $13a50dd07826f9eb$var$Track extends $13a50dd07826f9eb$require$Gesture {
    constructor(element, handler, options = {}){
        super("track", element, handler, {
            ...$13a50dd07826f9eb$var$Track.DEFAULTS,
            ...options
        });
    }
    /**
   * Filters out the state's data, down to what should be emitted.

   * @param {State} state - current input state.
   * @return {ReturnTypes.TrackData}
   */ data({ activePoints: activePoints  }) {
        return {
            active: activePoints
        };
    }
    tracks(phase) {
        return this.options.phases.includes(phase);
    }
    start(state) {
        return this.tracks("start") ? this.data(state) : null;
    }
    move(state) {
        return this.tracks("move") ? this.data(state) : null;
    }
    end(state) {
        return this.tracks("end") ? this.data(state) : null;
    }
    cancel(state) {
        return this.tracks("cancel") ? this.data(state) : null;
    }
}
$13a50dd07826f9eb$var$Track.DEFAULTS = Object.freeze({
    phases: Object.freeze([])
});
$13a50dd07826f9eb$exports = $13a50dd07826f9eb$var$Track;


module.exports = {
    Pan: $edded22326d64913$exports,
    Pinch: $a29eb49c9650e38a$exports,
    Press: $044241a6e313bbcb$exports,
    Pull: $b6747a8030ff7e4d$exports,
    Rotate: $2779699df4dafe8f$exports,
    Swipe: $29f6d3783b0fe128$exports,
    Swivel: $5bf1e923ca9fec67$exports,
    Tap: $2f0219f585763ab0$exports,
    Track: $13a50dd07826f9eb$exports,
    ...$17807945cdde5d67$exports
}; /**
 * Here are the return "types" of the gestures that are included in this
 * package.
 *
 * @namespace ReturnTypes
 */  /**
 * The base data that is included for all emitted gestures.
 *
 * @typedef {Object} BaseData
 *
 * @property {westures-core.Point2D} centroid - The centroid of the input
 * points.
 * @property {Event} event - The input event which caused the gesture to be
 * recognized.
 * @property {string} phase - 'start', 'move', 'end', or 'cancel'.
 * @property {string} type - The name of the gesture as specified by its
 * designer.
 * @property {Element} target - The bound target of the gesture.
 *
 * @memberof ReturnTypes
 */ 


//# sourceMappingURL=index.js.map
