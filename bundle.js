(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.zingtouch = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Access point for npm and node environments.
 */

module.exports = require('./src/ZingTouch.js');


},{"./src/ZingTouch.js":2}],2:[function(require,module,exports){
/**
 * @file ZingTouch.js
 * Main object containing API methods and Gesture constructors
 */

const Region  = require('./core/classes/Region.js');
const Gesture = require('./core/classes/Gesture.js');
const Pan     = require('./gestures/Pan.js');
const Pinch   = require('./gestures/Pinch.js');
const Rotate  = require('./gestures/Rotate.js');
const Swipe   = require('./gestures/Swipe.js');
const Tap     = require('./gestures/Tap.js');

// Currently keeping track of all regions.
const regions = [];

/**
 * The global API interface for ZingTouch. Contains a constructor for the
 * Region Object, and constructors for each predefined Gesture.
 * @type {Object}
 * @namespace ZingTouch
 */
const ZingTouch = {
  Gesture,
  Pan,
  Pinch,
  Rotate,
  Swipe,
  Tap,
  Region: function(element, capture, preventDefault) {
    const id = regions.length;
    const region = new Region(element, capture, preventDefault, id);
    regions.push(region);
    return region;
  },
};

module.exports = ZingTouch;

},{"./core/classes/Gesture.js":6,"./core/classes/Region.js":8,"./gestures/Pan.js":14,"./gestures/Pinch.js":15,"./gestures/Rotate.js":16,"./gestures/Swipe.js":17,"./gestures/Tap.js":18}],3:[function(require,module,exports){
/**
 * @file arbiter.js
 * Contains logic for the dispatcher
 */

const dispatcher  = require('./dispatcher.js');
const interpreter = require('./interpreter.js');
const util        = require('./util.js');

/**
 * Function that handles event flow, negotiating with the interpreter,
 * and dispatcher.
 * 1. Receiving all touch events in the window.
 * 2. Determining which gestures are linked to the target element.
 * 3. Negotiating with the Interpreter what event should occur.
 * 4. Sending events to the dispatcher to emit events to the target.
 * @param {Event} event - The event emitted from the window object.
 * @param {Object} region - The region object of the current listener.
 */
function arbiter(event, region) {
  const state = region.state;
  const eventType = util.normalizeEvent[ event.type ];

  /*
   Return if a gesture is not in progress and won't be. Also catches the case
   where a previous event is in a partial state (2 finger pan, waits for both
   inputs to reach touchend)
   */
  if (state.inputs.length === 0 && eventType !== 'start') {
    return;
  }

  /*
   Check for 'stale' or events that lost focus
   (e.g. a pan goes off screen/off region.)
   Does not affect mobile devices.
   */
  if (typeof event.buttons !== 'undefined' &&
    eventType !== 'end' &&
    event.buttons === 0) {
    state.resetInputs();
    return;
  }

  // Update the state with the new events. If the event is stopped, return;
  if (!state.updateInputs(event, region.element)) {
    return;
  }

  // Retrieve the initial target from any one of the inputs
  const bindings = state.retrieveBindingsByInitialPos();
  if (bindings.length > 0) {
    if (region.preventDefault) {
      util.setMSPreventDefault(region.element);
      util.preventDefault(event);
    } else {
      util.removeMSPreventDefault(region.element);
    }

    const toBeDispatched = {};
    const gestures = interpreter(bindings, event, state);

    /* Determine the deepest path index to emit the event
     from, to avoid duplicate events being fired. */

    const path = util.getPropagationPath(event);
    gestures.forEach((gesture) => {
      const id = gesture.binding.gesture.getId();
      if (toBeDispatched[id]) {
        if (util.getPathIndex(path, gesture.binding.element) <
          util.getPathIndex(path, toBeDispatched[id].binding.element)) {
          toBeDispatched[id] = gesture;
        }
      } else {
        toBeDispatched[id] = gesture;
      }
    });

    Object.keys(toBeDispatched).forEach((index) => {
      const gesture = toBeDispatched[index];
      dispatcher(gesture.binding, gesture.data, gesture.events);
    });
  }

  let endCount = 0;
  state.inputs.forEach((input) => {
    if (input.getCurrentEventType() === 'end') {
      endCount++;
    }
  });

  if (endCount === state.inputs.length) {
    state.resetInputs();
  }
}

module.exports = arbiter;

},{"./dispatcher.js":11,"./interpreter.js":12,"./util.js":13}],4:[function(require,module,exports){
/**
 * @file Binder.js
 */

/**
 * A chainable object that contains a single element to be bound upon.
 * Called from ZingTouch.bind(), and is used to chain over gesture callbacks.
 * @class
 */
class Binder {
  /**
   * Constructor function for the Binder class.
   * @param {Element} element - The element to bind gestures to.
   * @param {Boolean} bindOnce - Option to bind once and only emit
   * the event once.
   * @param {Object} state - The state of the Region that is being bound to.
   * @return {Object} - Returns 'this' to be chained over and over again.
   */
  constructor(element, bindOnce, state) {
    /**
     * The element to bind gestures to.
     * @type {Element}
     */
    this.element = element;

    Object.keys(state.registeredGestures).forEach((key) => {
      this[key] = (handler, capture) => {
        state.addBinding(this.element, key, handler, capture, bindOnce);
        return this;
      };
    });
  }
}

module.exports = Binder;

},{}],5:[function(require,module,exports){
/**
 * @file Binding.js
 */

/**
 * Responsible for creating a binding between an element and a gesture.
 * @class Binding
 */
class Binding {
  /**
   * Constructor function for the Binding class.
   * @param {Element} element - The element to associate the gesture to.
   * @param {Gesture} gesture - A instance of the Gesture type.
   * @param {Function} handler - The function handler to execute when a
   * gesture is recognized
   * on the associated element.
   * @param {Boolean} [capture=false] - A boolean signifying if the event is
   * to be emitted during
   * the capture or bubble phase.
   * @param {Boolean} [bindOnce=false] - A boolean flag
   * used for the bindOnce syntax.
   */
  constructor(element, gesture, handler, capture = false, bindOnce = false) {
    /**
     * The element to associate the gesture to.
     * @type {Element}
     */
    this.element = element;
    /**
     * A instance of the Gesture type.
     * @type {Gesture}
     */
    this.gesture = gesture;
    /**
     * The function handler to execute when a gesture is
     * recognized on the associated element.
     * @type {Function}
     */
    this.handler = handler;

    /**
     * A boolean signifying if the event is to be
     * emitted during the capture or bubble phase.
     * @type {Boolean}
     */
    this.capture = capture;

    /**
     * A boolean flag used for the bindOnce syntax.
     * @type {Boolean}
     */
    this.bindOnce = bindOnce;
  }
}

module.exports = Binding;

},{}],6:[function(require,module,exports){
/**
 * @file Gesture.js
 * Contains the Gesture class
 */

const util = require('../util.js');

/**
 * The Gesture class that all gestures inherit from.
 */
class Gesture {
  /**
   * Constructor function for the Gesture class.
   * @class Gesture
   */
  constructor() {
    /**
     * The generic string type of gesture ('expand'|'pan'|'pinch'|
     *  'rotate'|'swipe'|'tap').
     * @type {String}
     */
    this.type = null;

    /**
     * The unique identifier for each gesture determined at bind time by the
     * state object. This allows for distinctions across instance variables of
     * Gestures that are created on the fly (e.g. Tap-1, Tap-2, etc).
     * @type {String|null}
     */
    this.id = null;
  }

  /**
   * Set the id of the gesture to be called during an event
   * @param {String} id - The unique identifier of the gesture being created.
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Return the id of the event. If the id does not exist, return the type.
   * @return {String}
   */
  getId() {
    return (this.id !== null) ? this.id : this.type;
  }

  /**
   * Updates internal properties with new ones, only if the properties exist.
   * @param {Object} object
   */
  update(object) {
    Object.keys(object).forEach( key => {
      this[key] = object[key];
    });
  }

  /**
   * start() - Event hook for the start of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null|Object}  - Default of null
   */
  start(inputs, state, element) {
    return null;
  }

  /**
   * move() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null|Object} - Default of null
   */
  move(inputs, state, element) {
    return null;
  }

  /**
   * end() - Event hook for the move of a gesture
   * @param {Array} inputs - The array of Inputs on the screen
   * @return {null|Object}  - Default of null
   */
  end(inputs) {
    return null;
  }

  /**
  * isValid() - Pre-checks to ensure the invariants of a gesture are satisfied.
  * @param {Array} inputs - The array of Inputs on the screen
  * @param {Object} state - The state object of the current region.
  * @param {Element} element - The element associated to the binding.
  * @return {boolean} - If the gesture is valid
  */
  isValid(inputs, state, element) {
    return inputs.every( input => {
        return util.isInside(input.initial.x, input.initial.y, element);
    });
  }
}

module.exports = Gesture;

},{"../util.js":13}],7:[function(require,module,exports){
/**
 * @file Input.js
 */

const ZingEvent = require('./ZingEvent.js');

/**
 * Tracks a single input and contains information about the
 * current, previous, and initial events.
 * Contains the progress of each Input and it's associated gestures.
 * @class Input
 */
class Input {
  /**
   * Constructor function for the Input class.
   * @param {Event} event - The Event object from the window
   * @param {Number} [identifier=0] - The identifier for each input event
   * (taken from event.changedTouches)
   */
  constructor(event, identifier = 0) {
    let currentEvent = new ZingEvent(event, identifier);

    /**
     * Holds the initial event object. A touchstart/mousedown event.
     * @type {ZingEvent}
     */
    this.initial = currentEvent;

    /**
     * Holds the most current event for this Input, disregarding any other past,
     * current, and future events that other Inputs participate in.
     * e.g. This event ended in an 'end' event, but another Input is still
     * participating in events -- this will not be updated in such cases.
     * @type {ZingEvent}
     */
    this.current = currentEvent;

    /**
     * Holds the previous event that took place.
     * @type {ZingEvent}
     */
    this.previous = currentEvent;

    /**
     * Refers to the event.touches index, or 0 if a simple mouse event occurred.
     * @type {Number}
     */
    this.identifier = identifier;

    /**
     * Stores internal state between events for
     * each gesture based off of the gesture's id.
     * @type {Object}
     */
    this.progress = {};
  }

  /**
   * Receives an input, updates the internal state of what the input has done.
   * @param {Event} event - The event object to wrap with a ZingEvent.
   * @param {Number} touchIdentifier - The index of inputs, from event.touches
   */
  update(event, touchIdentifier) {
    this.previous = this.current;
    this.current = new ZingEvent(event, touchIdentifier);
  }

  /**
   * Returns the progress of the specified gesture.
   * @param {String} id - The identifier for each unique Gesture's progress.
   * @return {Object} - The progress of the gesture.
   * Creates an empty object if no progress has begun.
   */
  getGestureProgress(id) {
    if (!this.progress[id]) {
      this.progress[id] = {};
    }
    return this.progress[id];
  }

  /**
   * Returns the normalized current Event's type.
   * @return {String} The current event's type ( start | move | end )
   */
  getCurrentEventType() {
    return this.current.type;
  }

  /**
   * Resets a progress/state object of the specified gesture.
   * @param {String} id - The identifier of the specified gesture
   */
  resetProgress(id) {
    this.progress[id] = {};
  }
}

module.exports = Input;

},{"./ZingEvent.js":10}],8:[function(require,module,exports){
/**
 * @file Region.js
 */

const Binder  = require('./Binder.js');
const Gesture = require('./Gesture.js');
const arbiter = require('./../arbiter.js');
const State   = require('./State.js');

/**
 * Allows the user to specify a region to capture all events to feed ZingTouch
 * into. This can be as narrow as the element itself, or as big as the document
 * itself. The more specific an area, the better performant the overall
 * application will perform. Contains API methods to bind/unbind specific
 * elements to corresponding gestures. Also contains the ability to
 * register/unregister new gestures.
 * @class Region
 */
class Region {
  /**
   * Constructor function for the Region class.
   * @param {Element} element - The element to capture all
   *  window events in that region to feed into ZingTouch.
   * @param {boolean} [capture=false] - Whether the region listens for
   *  captures or bubbles.
   * @param {boolean} [preventDefault=true] - Whether the default browser
   *  functionality should be disabled;
   * @param {Number} id - The id of the region, assigned by the ZingTouch object
   */
  constructor(element, capture = false, preventDefault = true, id) {
    /**
     * The identifier for the Region. This is assigned by the ZingTouch object
     * and is used to hash gesture id for uniqueness.
     * @type {Number}
     */
    this.id = id;

    /**
     * The element being bound to.
     * @type {Element}
     */
    this.element = element;

    /**
     * Whether the region listens for captures or bubbles.
     * @type {boolean}
     */
    this.capture = capture;

    /**
     * Boolean to disable browser functionality such as scrolling and zooming
     * over the region
     * @type {boolean}
     */
    this.preventDefault = preventDefault;

    /**
     * The internal state object for a Region.
     * Keeps track of registered gestures, inputs, and events.
     * @type {State}
     */
    this.state = new State(id);

    let eventNames = [];
    if (window.PointerEvent && !window.TouchEvent) {
      eventNames = [
        'pointerdown',
        'pointermove',
        'pointerup',
      ];
    } else {
      eventNames = [
        'mousedown',
        'mousemove',
        'mouseup',
        'touchstart',
        'touchmove',
        'touchend',
      ];
    }

    // Bind detected browser events to the region element.
    eventNames.forEach((name) => {
      element.addEventListener(name, (e) => {
        arbiter(e, this);
      }, this.capture);
    });
  }

  /**
   * Bind an element to a registered/unregistered gesture with
   * multiple function signatures.
   * @example
   * bind(element) - chainable
   * @example
   * bind(element, gesture, handler, [capture])
   * @param {Element} element - The element object.
   * @param {String|Object} [gesture] - Gesture key, or a Gesture object.
   * @param {Function} [handler] - The function to execute when an event is
   *  emitted.
   * @param {Boolean} [capture] - capture/bubble
   * @param {Boolean} [bindOnce = false] - Option to bind once and
   *  only emit the event once.
   * @return {Object} - a chainable object that has the same function as bind.
   */
  bind(element, gesture, handler, capture, bindOnce) {
    if (!element || (element && !element.tagName)) {
      throw 'Bind must contain an element';
    }

    bindOnce = (typeof bindOnce !== 'undefined') ? bindOnce : false;
    if (!gesture) {
      return new Binder(element, bindOnce, this.state);
    } else {
      this.state.addBinding(element, gesture, handler, capture, bindOnce);
    }
  }

  /**
   * Bind an element and sets up actions to remove the binding once
   * it has been emitted for the first time.
   * 1. bind(element) - chainable
   * 2. bind(element, gesture, handler, [capture])
   * @param {Element} element - The element object.
   * @param {String|Object} gesture - Gesture key, or a Gesture object.
   * @param {Function} handler - The function to execute when an
   *  event is emitted.
   * @param {Boolean} capture - capture/bubble
   * @return {Object} - a chainable object that has the same function as bind.
   */
  bindOnce(element, gesture, handler, capture) {
    this.bind(element, gesture, handler, capture, true);
  }

  /**
   * Unbinds an element from either the specified gesture
   *  or all if no element is specified.
   * @param {Element} element -The element to remove.
   * @param {String | Object} [gesture] - A String representing the gesture,
   *   or the actual object being used.
   * @return {Array} - An array of Bindings that were unbound to the element;
   */
  unbind(element, gesture) {
    let bindings = this.state.retrieveBindingsByElement(element);
    let unbound = [];

    bindings.forEach((binding) => {
      if (gesture) {
        if (typeof gesture === 'string' &&
          this.state.registeredGestures[gesture]) {
          let registeredGesture = this.state.registeredGestures[gesture];
          if (registeredGesture.id === binding.gesture.id) {
            element.removeEventListener(
              binding.gesture.getId(),
              binding.handler, binding.capture);
            unbound.push(binding);
          }
        }
      } else {
        element.removeEventListener(
          binding.gesture.getId(),
          binding.handler,
          binding.capture);
        unbound.push(binding);
      }
    });

    return unbound;
  }

  /* unbind*/

  /**
   * Registers a new gesture with an assigned key
   * @param {String} key - The key used to register an element to that gesture
   * @param {Gesture} gesture - A gesture object
   */
  register(key, gesture) {
    if (typeof key !== 'string') {
      throw new Error('Parameter key is an invalid string');
    }

    if (!gesture instanceof Gesture) {
      throw new Error('Parameter gesture is an invalid Gesture object');
    }

    gesture.type = key;
    this.state.registerGesture(gesture, key);
  }

  /* register*/

  /**
   * Un-registers a gesture from the Region's state such that
   * it is no longer emittable.
   * Unbinds all events that were registered with the type.
   * @param {String|Object} key - Gesture key that was used to
   *  register the object
   * @return {Object} - The Gesture object that was unregistered
   *  or null if it could not be found.
   */
  unregister(key) {
    this.state.bindings.forEach((binding) => {
      if (binding.gesture.type === key) {
        binding.element.removeEventListener(binding.gesture.getId(),
          binding.handler, binding.capture);
      }
    });

    let registeredGesture = this.state.registeredGestures[key];
    delete this.state.registeredGestures[key];
    return registeredGesture;
  }
}

module.exports = Region;

},{"./../arbiter.js":3,"./Binder.js":4,"./Gesture.js":6,"./State.js":9}],9:[function(require,module,exports){
/**
 * @file State.js
 */

const Gesture = require('./Gesture.js');
const Pan     = require('./../../gestures/Pan.js');
const Pinch   = require('./../../gestures/Pinch.js');
const Rotate  = require('./../../gestures/Rotate.js');
const Swipe   = require('./../../gestures/Swipe.js');
const Tap     = require('./../../gestures/Tap.js');
const Binding = require('./Binding.js');
const Input   = require('./Input.js');
const util    = require('./../util.js');

const DEFAULT_MOUSE_ID = 0;

/**
 * Creates an object related to a Region's state,
 * and contains helper methods to update and clean up different states.
 */
class State {
  /**
   * Constructor for the State class.
   * @param {String} regionId - The id the region this state is bound to.
   */
  constructor(regionId) {
    /**
     * The id for the region this state is bound to.
     * @type {String}
     */
    this.regionId = regionId;

    /**
     * An array of current and recently inactive
     *  Input objects related to a gesture.
     * @type {Input}
     */
    this.inputs = [];

    /**
     * An array of Binding objects; The list of relations between elements,
     *   their gestures, and the handlers.
     * @type {Binding}
     */
    this.bindings = [];

    /**
     * The number of gestures that have been registered with this state
     * @type {Number}
     */
    this.numGestures = 0;

    /**
     * A key/value map all the registered gestures for the listener.
     *  Note: Can only have one gesture registered to one key.
     * @type {Object}
     */
    this.registeredGestures = {};

    this.registerGesture(new Pan(), 'pan');
    this.registerGesture(new Rotate(), 'rotate');
    this.registerGesture(new Pinch(), 'pinch');
    this.registerGesture(new Swipe(), 'swipe');
    this.registerGesture(new Tap(), 'tap');
  }

  /**
   * Creates a new binding with the given element and gesture object.
   * If the gesture object provided is unregistered, it's reference
   * will be saved in as a binding to be later referenced.
   * @param  {Element} element - The element the gesture is bound to.
   * @param {String|Object} gesture  - Either a name of a registered gesture,
   *  or an unregistered  Gesture object.
   * @param {Function} handler - The function handler to be called
   *  when the event is emitted. Used to bind/unbind.
   * @param {Boolean} capture - Whether the gesture is to be
   *  detected in the capture of bubble phase. Used to bind/unbind.
   * @param {Boolean} bindOnce - Option to bind once and
   *  only emit the event once.
   */
  addBinding(element, gesture, handler, capture, bindOnce) {
    let boundGesture;

    // Error type checking.
    if (element && typeof element.tagName === 'undefined') {
      throw new Error('Parameter element is an invalid object.');
    }

    if (typeof handler !== 'function') {
      throw new Error('Parameter handler is invalid.');
    }

    if (typeof gesture === 'string' &&
      Object.keys(this.registeredGestures).indexOf(gesture) === -1) {
      throw new Error('Parameter ' + gesture + ' is not a registered gesture');
    } else if (typeof gesture === 'object' && !(gesture instanceof Gesture)) {
      throw new Error('Parameter for the gesture is not of a Gesture type');
    }

    if (typeof gesture === 'string') {
      boundGesture = this.registeredGestures[gesture];
    } else {
      boundGesture = gesture;
      if (boundGesture.id === '') {
        this.assignGestureId(boundGesture);
      }
    }

    this.bindings.push(new Binding(element, boundGesture,
      handler, capture, bindOnce));
    element.addEventListener(boundGesture.getId(), handler, capture);
  }

  /**
   * Retrieves the Binding by which an element is associated to.
   * @param {Element} element - The element to find bindings to.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByElement(element) {
    return this.bindings.filter( b => b.element === element );
  }

  /**
   * Retrieves all bindings based upon the initial X/Y position of the inputs.
   * e.g. if gesture started on the correct target element,
   *  but diverted away into the correct region, this would still be valid.
   * @return {Array} - An array of Bindings to which that element is bound
   */
  retrieveBindingsByInitialPos() {
    return this.bindings.filter( binding => {
      return this.inputs.some( input => {
        return util.isInside(input.initial.x, input.initial.y, binding.element);
      });
    });
  }

  /**
   * Updates the inputs with new information based upon a new event being fired.
   * @param {Event} event - The event being captured.
   * @param {Element} regionElement - The element where
   *  this current Region is bound to.
   * @return {boolean} - returns true for a successful update,
   *  false if the event is invalid.
   */
  updateInputs(event, regionElement) {
    let eventType = (event.touches) ?
      'TouchEvent' : ((event.pointerType) ? 'PointerEvent' : 'MouseEvent');
    switch (eventType) {
      case 'TouchEvent':
        Array.from(event.changedTouches).forEach( touch => {
          update(event, this, touch.identifier, regionElement);
        });
        break;

      case 'PointerEvent':
        update(event, this, event.pointerId, regionElement);
        break;

      case 'MouseEvent':
      default:
        update(event, this, DEFAULT_MOUSE_ID, regionElement);
        break;
    }
    return true;

    function update(event, state, identifier, regionElement) {
      const eventType = util.normalizeEvent[ event.type ];
      const input = findInputById(state.inputs, identifier);

      // A starting input was not cleaned up properly and still exists.
      if (eventType === 'start' && input) {
        state.resetInputs();
        return;
      }

      // An input has moved outside the region.
      if (eventType !== 'start' &&
        input &&
        !util.isInside(input.current.x, input.current.y, regionElement)) {
         state.resetInputs();
        return;
      }

      if (eventType !== 'start' && !input) {
        state.resetInputs();
        return;
      }

      if (eventType === 'start') {
        state.inputs.push(new Input(event, identifier));
      } else {
        input.update(event, identifier);
      }
    }
  }

  /**
   * Removes all inputs from the state, allowing for a new gesture.
   */
  resetInputs() {
    this.inputs = [];
  }

  /**
   * Counts the number of active inputs at any given time.
   * @return {Number} - The number of active inputs.
   */
  numActiveInputs() {
    const endType = this.inputs.filter((input) => {
      return input.current.type !== 'end';
    });
    return endType.length;
  }

  /**
   * Register the gesture to the current region.
   * @param {Object} gesture - The gesture to register
   * @param {String} key - The key to define the new gesture as.
   */
  registerGesture(gesture, key) {
    this.assignGestureId(gesture);
    this.registeredGestures[key] = gesture;
  }

  /**
   * Tracks the gesture to this state object to become uniquely identifiable.
   * Useful for nested Regions.
   * @param {Gesture} gesture - The gesture to track
   */
  assignGestureId(gesture) {
    gesture.setId(this.regionId + '-' + this.numGestures++);
  }
}

/**
 * Searches through each input, comparing the browser's identifier key
 *  for touches, to the stored one in each input
 * @param {Array} inputs - The array of inputs in state.
 * @param {String} identifier - The identifier the browser has assigned.
 * @return {Input} - The input object with the corresponding identifier,
 *  null if it did not find any.
 */
function findInputById(inputs, identifier) {
  return inputs.find( i => i.identifier === identifier );
}

module.exports = State;

},{"./../../gestures/Pan.js":14,"./../../gestures/Pinch.js":15,"./../../gestures/Rotate.js":16,"./../../gestures/Swipe.js":17,"./../../gestures/Tap.js":18,"./../util.js":13,"./Binding.js":5,"./Gesture.js":6,"./Input.js":7}],10:[function(require,module,exports){
/**
 * @file ZingEvent.js
 * Contains logic for ZingEvents
 */

const util = require('../util.js');

const INITIAL_COORDINATE = 0;
/**
 * An event wrapper that normalizes events across browsers and input devices
 * @class ZingEvent
 */
class ZingEvent {
  /**
   * @constructor
   * @param {Event} event - The event object being wrapped.
   * @param {Array} event.touches - The number of touches on
   *  a screen (mobile only).
   * @param {Object} event.changedTouches - The TouchList representing
   * points that participated in the event.
   * @param {Number} touchIdentifier - The index of touch if applicable
   */
  constructor(event, touchIdentifier) {
    /**
     * The original event object.
     * @type {Event}
     */
    this.originalEvent = event;

    /**
     * The type of event or null if it is an event not predetermined.
     * @see util.normalizeEvent
     * @type {String | null}
     */
    this.type = util.normalizeEvent[ event.type ];

    /**
     * The X coordinate for the event, based off of the client.
     * @type {number}
     */
    this.x = INITIAL_COORDINATE;

    /**
     * The Y coordinate for the event, based off of the client.
     * @type {number}
     */
    this.y = INITIAL_COORDINATE;

    let eventObj;
    if (event.touches && event.changedTouches) {
      eventObj = Array.from(event.changedTouches).find( t => {
        return t.identifier === touchIdentifier;
      });
    } else {
      eventObj = event;
    }

    this.x = this.clientX = eventObj.clientX;
    this.y = this.clientY = eventObj.clientY;

    this.pageX = eventObj.pageX;
    this.pageY = eventObj.pageY;

    this.screenX = eventObj.screenX;
    this.screenY = eventObj.screenY;
  }
}

module.exports = ZingEvent;

},{"../util.js":13}],11:[function(require,module,exports){
/**
 * @file dispatcher.js
 * Contains logic for the dispatcher
 */

/**
 * Emits data at the target element if available, and bubbles up from
 * the target to the parent until the document has been reached.
 * Called from the arbiter.
 * @param {Binding} binding - An object of type Binding
 * @param {Object} data - The metadata computed by the gesture being emitted.
 * @param {Array} events - An array of ZingEvents
 *  corresponding to the inputs on the screen.
 */
function dispatcher(binding, data, events) {
  data.events = events;

  const newEvent = new CustomEvent(binding.gesture.getId(), {
    detail: data,
    bubbles: true,
    cancelable: true,
  });
  emitEvent(binding.element, newEvent, binding);
}

/**
 * Emits the new event. Unbinds the event if the event was registered
 * at bindOnce.
 * @param {Element} target - Element object to emit the event to.
 * @param {Event} event - The CustomEvent to emit.
 * @param {Binding} binding - An object of type Binding
 */
function emitEvent(target, event, binding) {
  target.dispatchEvent(event);
  if (binding.bindOnce) {
    ZingTouch.unbind(binding.element, binding.gesture.type);
  }
}

module.exports = dispatcher;

},{}],12:[function(require,module,exports){
/**
 * @file interpreter.js
 * Contains logic for the interpreter
 */

const util = require('./util.js');

/**
 * Receives an event and an array of Bindings (element -> gesture handler)
 * to determine what event will be emitted. Called from the arbiter.
 * @param {Array} bindings - An array containing Binding objects
 * that associate the element to an event handler.
 * @param {Object} event - The event emitted from the window.
 * @param {Object} state - The state object of the current listener.
 * @return {Object | null} - Returns an object containing a binding and
 * metadata, or null if a gesture will not be emitted.
 */
function interpreter(bindings, event, state) {
  const evType = util.normalizeEvent[ event.type ];
  const events = state.inputs.map( input => input.current );

  const candidates = bindings.reduce( (accumulator, binding) => {
    const data = binding.gesture[evType](state.inputs, state, binding.element);
    if (data) accumulator.push({ binding, data, events });
    return accumulator;
  }, []);

  return candidates;
}

module.exports = interpreter;

},{"./util.js":13}],13:[function(require,module,exports){
/**
 * @file util.js
 * Various accessor and mutator functions to handle state and validation.
 */

const CIRCLE_DEGREES = 360;
const HALF_CIRCLE_DEGREES = 180;

/**
 *  Contains generic helper functions
 * @type {Object}
 * @namespace util
 */
let util = {
  /**
   * Normalizes window events to be either of type start, move, or end.
   * @param {String} type - The event type emitted by the browser
   * @return {null|String} - The normalized event, or null if it is an
   * event not predetermined.
   */
  normalizeEvent: Object.freeze({
      mousedown:   'start',
      touchstart:  'start',
      pointerdown: 'start',

      mousemove:   'move',
      touchmove:   'move',
      pointermove: 'move',

      mouseup:   'end',
      touchend:  'end',
      pointerup: 'end',
  }),
  /* normalizeEvent*/

  /**
   * Determines if the current and previous coordinates are within or
   * up to a certain tolerance.
   * @param {Number} currentX - Current event's x coordinate
   * @param {Number} currentY - Current event's y coordinate
   * @param {Number} previousX - Previous event's x coordinate
   * @param {Number} previousY - Previous event's y coordinate
   * @param {Number} tolerance - The tolerance in pixel value.
   * @return {boolean} - true if the current coordinates are
   * within the tolerance, false otherwise
   */
  isWithin(currentX, currentY, previousX, previousY, tolerance) {
    return ((Math.abs(currentY - previousY) <= tolerance) &&
    (Math.abs(currentX - previousX) <= tolerance));
  },
  /* isWithin*/

  /**
   * Calculates the distance between two points.
   * @param {Number} x0
   * @param {Number} x1
   * @param {Number} y0
   * @param {Number} y1
   * @return {number} The numerical value between two points
   */
  distanceBetweenTwoPoints(x0, x1, y0, y1) {
    let dist = (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
    return Math.round(dist * 100) / 100;
  },

  /**
   * Calculates the midpoint coordinates between two points.
   * @param {Number} x0
   * @param {Number} x1
   * @param {Number} y0
   * @param {Number} y1
   * @return {Object} The coordinates of the midpoint.
   */
  getMidpoint(x0, x1, y0, y1) {
    return {
      x: ((x0 + x1) / 2),
      y: ((y0 + y1) / 2),
    };
  },
  /**
   * Calculates the angle between the projection and an origin point.
   *   |                (projectionX,projectionY)
   *   |             /°
   *   |          /
   *   |       /
   *   |    / θ
   *   | /__________
   *   ° (originX, originY)
   * @param {number} originX
   * @param {number} originY
   * @param {number} projectionX
   * @param {number} projectionY
   * @return {number} - Degree along the unit circle where the project lies
   */
  getAngle(originX, originY, projectionX, projectionY) {
    let angle = Math.atan2(projectionY - originY, projectionX - originX) *
      ((HALF_CIRCLE_DEGREES) / Math.PI);
    return CIRCLE_DEGREES - ((angle < 0) ? (CIRCLE_DEGREES + angle) : angle);
  },
  /**
   * Calculates the angular distance in degrees between two angles
   *  along the unit circle
   * @param {number} start - The starting point in degrees
   * @param {number} end - The ending point in degrees
   * @return {number} The number of degrees between the
   * starting point and ending point. Negative degrees denote a clockwise
   * direction, and positive a counter-clockwise direction.
   */
  getAngularDistance(start, end) {
    let angle = (end - start) % CIRCLE_DEGREES;
    let sign = (angle < 0) ? 1 : -1;
    angle = Math.abs(angle);
    return (angle > HALF_CIRCLE_DEGREES) ?
    sign * (CIRCLE_DEGREES - angle) : sign * angle;
  },

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
  getVelocity(startX, startY, startTime, endX, endY, endTime) {
    let distance = this.distanceBetweenTwoPoints(startX, endX, startY, endY);
    return (distance / (endTime - startTime));
  },

  /**
   * Returns the farthest right input
   * @param {Array} inputs
   * @return {Object}
   */
  getRightMostInput(inputs) {
    let rightMost = null;
    let distance = Number.MIN_VALUE;
    inputs.forEach((input) => {
      if (input.initial.x > distance) {
        rightMost = input;
      }
    });
    return rightMost;
  },

  /**
   * Determines is the value is an integer and not a floating point
   * @param {Mixed} value
   * @return {boolean}
   */
  isInteger(value) {
    return (typeof value === 'number') && (value % 1 === 0);
  },

  /**
   * Determines if the x,y position of the input is within then target.
   * @param {Number} x -clientX
   * @param {Number} y -clientY
   * @param {Element} target
   * @return {Boolean}
   */
  isInside(x, y, target) {
    const rect = target.getBoundingClientRect();
    return ((x > rect.left && x < rect.left + rect.width) &&
    (y > rect.top && y < rect.top + rect.height));
  },
  /**
   * Polyfill for event.propagationPath
   * @param {Event} event
   * @return {Array}
   */
  getPropagationPath(event) {
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
  },

  /**
   * Retrieve the index inside the path array
   * @param {Array} path
   * @param {Element} element
   * @return {Element}
   */
  getPathIndex(path, element) {
    let index = path.length;

    path.forEach((obj, i) => {
      if (obj === element) {
        index = i;
      }
    });

    return index;
  },

  setMSPreventDefault(element) {
    element.style['-ms-content-zooming'] = 'none';
    element.style['touch-action'] = 'none';
  },

  removeMSPreventDefault(element) {
    element.style['-ms-content-zooming'] = '';
    element.style['touch-action'] = '';
  },

  preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
};

module.exports = util;

},{}],14:[function(require,module,exports){
/**
 * @file Pan.js
 * Contains the Pan class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 1;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pan is defined as a normal movement in any direction on a screen.
 * Pan gestures do not track start events and can interact with pinch and \
 *  expand gestures.
 * @class Pan
 */
class Pan extends Gesture {
  /**
   * Constructor function for the Pan class.
   * @param {Object} [options] - The options object.
   * @param {Number} [options.numInputs=1] - Number of inputs for the
   *  Pan gesture.
   * @param {Number} [options.threshold=1] - The minimum number of
   * pixels the input has to move to trigger this gesture.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pan';

    /**
     * The number of inputs to trigger a Pan can be variable,
     * and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * The minimum amount in pixels the pan must move until it is fired.
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Event hook for the start of a gesture. Marks each input as active,
   * so it can invalidate any end events.
   * @param {Array} inputs
   */
  start(inputs) {
    inputs.forEach((input) => {
      const progress = input.getGestureProgress(this.getId());
      progress.active = true;
      progress.lastEmitted = {
        x: input.current.x,
        y: input.current.y,
      };
    });
  }
  /* start */

  /**
   * move() - Event hook for the move of a gesture.
   * Fired whenever the input length is met, and keeps a boolean flag that
   * the gesture has fired at least once.
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {Object} - Returns the distance in pixels between the two inputs.
   */
  move(inputs, state, element) {
    if (this.numInputs !== inputs.length) return null;

    const output = {
      data: [],
    };

    inputs.forEach( (input, index) => {
      const progress = input.getGestureProgress(this.getId());
      const distanceFromLastEmit = util.distanceBetweenTwoPoints(
        progress.lastEmitted.x,
        progress.lastEmitted.y,
        input.current.x,
        input.current.y
      );
      const reachedThreshold = distanceFromLastEmit >= this.threshold;

      if (progress.active && reachedThreshold) {
        output.data[index] = packData( input, progress );
        progress.lastEmitted.x = input.current.x;
        progress.lastEmitted.y = input.current.y;
      } 
    });

    return output;
  }
  /* move*/

  /**
   * end() - Event hook for the end of a gesture. If the gesture has at least
   * fired once, then it ends on the first end event such that any remaining
   * inputs will not trigger the event until all inputs have reached the
   * touchend event. Any touchend->touchstart events that occur before all
   * inputs are fully off the screen should not fire.
   * @param {Array} inputs - The array of Inputs on the screen
   * @return {null} - null if the gesture is not to be emitted,
   *  Object with information otherwise.
   */
  end(inputs) {
    inputs.forEach((input) => {
      const progress = input.getGestureProgress(this.getId());
      progress.active = false;
    });
    return null;
  }
  /* end*/
}

function packData( input, progress ) {
  const distanceFromOrigin = util.distanceBetweenTwoPoints(
    input.initial.x,
    input.current.x,
    input.initial.y,
    input.current.y
  );
  const directionFromOrigin = util.getAngle(
    input.initial.x,
    input.initial.y,
    input.current.x,
    input.current.y
  );
  const currentDirection = util.getAngle(
    progress.lastEmitted.x,
    progress.lastEmitted.y,
    input.current.x,
    input.current.y
  );
  const change = {
    x: input.current.x - progress.lastEmitted.x,
    y: input.current.y - progress.lastEmitted.y,
  };

  return {
    distanceFromOrigin,
    directionFromOrigin,
    currentDirection,
    change,
  };
}

module.exports = Pan;

},{"./../core/classes/Gesture.js":6,"./../core/util.js":13}],15:[function(require,module,exports){
/**
 * @file Pinch.js
 * Contains the abstract Pinch class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 2;
const DEFAULT_MIN_THRESHOLD = 1;

/**
 * A Pinch is defined as two inputs moving either together or apart.
 * @class Pinch
 */
class Pinch extends Gesture {
  /**
   * Constructor function for the Pinch class.
   * @param {Object} options
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'pinch';

    /**
     * The minimum amount in pixels the inputs must move until it is fired.
     * @type {Number}
     */
    this.threshold = options.threshold || DEFAULT_MIN_THRESHOLD;
  }

  /**
   * Event hook for the start of a gesture. Initialized the lastEmitted
   * gesture and stores it in the first input for reference events.
   * @param {Array} inputs
   */
  start(inputs, state, element) {
    if(!this.isValid(inputs, state, element)) {
      return null;
    }
    if (inputs.length === DEFAULT_INPUTS) {
      // Store the progress in the first input.
      const progress = inputs[0].getGestureProgress(this.type);
      progress.lastEmittedDistance = util.distanceBetweenTwoPoints(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);
    }
  }

  /**
   * Event hook for the move of a gesture.
   *  Determines if the two points are moved in the expected direction relative
   *  to the current distance and the last distance.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {Object | null} - Returns the distance in pixels between two inputs
   */
  move(inputs, state, element) {
    if (state.numActiveInputs() === DEFAULT_INPUTS) {
      const currentDistance = util.distanceBetweenTwoPoints(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);
      const centerPoint = util.getMidpoint(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);

      // Progress is stored in the first input.
      const progress = inputs[0].getGestureProgress(this.type);
      const change = currentDistance - progress.lastEmittedDistance;

      if (Math.abs(change) >= this.threshold) {
        progress.lastEmittedDistance = currentDistance;
        return {
          distance: currentDistance,
          center: centerPoint,
          change: change,
        };
      }
    }

    return null;
  }
}

module.exports = Pinch;

},{"./../core/classes/Gesture.js":6,"./../core/util.js":13}],16:[function(require,module,exports){
/**
 * @file Rotate.js
 * Contains the Rotate class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 2;

/**
 * A Rotate is defined as two inputs moving about a circle,
 * maintaining a relatively equal radius.
 * @class Rotate
 */
class Rotate extends Gesture {
  /**
   * Constructor function for the Rotate class.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'rotate';

    /**
     * The number of touches required to emit Rotate events.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;
  }

  /**
   * move() - Event hook for the move of a gesture. Obtains the midpoint of two
   * the two inputs and calculates the projection of the right most input along
   * a unit circle to obtain an angle. This angle is compared to the previously
   * calculated angle to output the change of distance, and is compared to the
   * initial angle to output the distance from the initial angle to the current
   * angle.
   * @param {Array} inputs - The array of Inputs on the screen
   * @param {Object} state - The state object of the current listener.
   * @param {Element} element - The element associated to the binding.
   * @return {null} - null if this event did not occur
   * @return {Object} obj.angle - The current angle along the unit circle
   * @return {Object} obj.distanceFromOrigin - The angular distance travelled
   * from the initial right most point.
   * @return {Object} obj.distanceFromLast - The change of angle between the
   * last position and the current position.
   */
  move(inputs, state, element) {
    const numActiveInputs = state.numActiveInputs();
    if (this.numInputs !== numActiveInputs) return null;

    let currentPivot, initialPivot;
    let input;
    if (numActiveInputs === 1) {
      const bRect = element.getBoundingClientRect();
      currentPivot = {
        x: bRect.left + bRect.width / 2,
        y: bRect.top + bRect.height / 2,
      };
      initialPivot = currentPivot;
      input = inputs[0];
    } else {
      currentPivot = util.getMidpoint(
        inputs[0].current.x,
        inputs[1].current.x,
        inputs[0].current.y,
        inputs[1].current.y);
      input = util.getRightMostInput(inputs);
    }

    // Translate the current pivot point.
    const currentAngle = util.getAngle(
      currentPivot.x, 
      currentPivot.y,
      input.current.x,
      input.current.y);

    const progress = input.getGestureProgress(this.getId());
    if (!progress.initialAngle) {
      progress.initialAngle = progress.previousAngle = currentAngle;
      progress.distance = progress.change = 0;
    } else {
      progress.change = util.getAngularDistance(
        progress.previousAngle,
        currentAngle);
      progress.distance = progress.distance + progress.change;
    }

    progress.previousAngle = currentAngle;

    return {
      angle: currentAngle,
      distanceFromOrigin: progress.distance,
      distanceFromLast: progress.change,
    };
  }

  /* move*/
}

module.exports = Rotate;

},{"./../core/classes/Gesture.js":6,"./../core/util.js":13}],17:[function(require,module,exports){
/**
 * @file Swipe.js
 * Contains the Swipe class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_INPUTS = 1;
const DEFAULT_MAX_REST_TIME = 100;
const DEFAULT_ESCAPE_VELOCITY = 0.2;
const DEFAULT_TIME_DISTORTION = 100;
const DEFAULT_MAX_PROGRESS_STACK = 10;

/**
 * A swipe is defined as input(s) moving in the same direction in an relatively
 * increasing velocity and leaving the screen at some point before it drops
 * below it's escape velocity.
 * @class Swipe
 */
class Swipe extends Gesture {
  /**
   * Constructor function for the Swipe class.
   * @param {Object} [options] - The options object.
   * @param {Number} [options.numInputs] - The number of inputs to trigger a
   * Swipe can be variable, and the maximum number being a factor of the browser
   *  move and current move events.
   * @param {Number} [options.maxRestTime] - The maximum resting time a point
   *  has between it's last
   * @param {Number} [options.escapeVelocity] - The minimum velocity the input
   *  has to be at to emit a swipe.
   * @param {Number} [options.timeDistortion] - (EXPERIMENTAL) A value of time
   *  in milliseconds to distort between events.
   * @param {Number} [options.maxProgressStack] - (EXPERIMENTAL)The maximum
   *  amount of move events to keep
   * track of for a swipe.
   */
  constructor(options = {}) {
    super();
    /**
     * The type of the Gesture
     * @type {String}
     */
    this.type = 'swipe';

    /**
     * The number of inputs to trigger a Swipe can be variable,
     * and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * The maximum resting time a point has between it's last move and
     * current move events.
     * @type {Number}
     */
    this.maxRestTime = options.maxRestTime || DEFAULT_MAX_REST_TIME;

    /**
     * The minimum velocity the input has to be at to emit a swipe.
     * This is useful for determining the difference between
     * a swipe and a pan gesture.
     * @type {number}
     */
    this.escapeVelocity = options.escapeVelocity || DEFAULT_ESCAPE_VELOCITY;

    /**
     * (EXPERIMENTAL) A value of time in milliseconds to distort between events.
     * Browsers do not accurately measure time with the Date constructor in
     * milliseconds, so consecutive events sometimes display the same timestamp
     * but different x/y coordinates. This will distort a previous time
     * in such cases by the timeDistortion's value.
     * @type {number}
     */
    this.timeDistortion = options.timeDistortion || DEFAULT_TIME_DISTORTION;

    /**
     * (EXPERIMENTAL) The maximum amount of move events to keep track of for a
     * swipe. This helps give a more accurate estimate of the user's velocity.
     * @type {number}
     */
    this.maxProgressStack = options.maxProgressStack || 
      DEFAULT_MAX_PROGRESS_STACK;
  }

  /**
   * Event hook for the move of a gesture. Captures an input's x/y coordinates
   * and the time of it's event on a stack.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null} - Swipe does not emit from a move.
   */
  move(inputs, state, element) {
    if (this.numInputs === inputs.length) {
      for (let i = 0; i < inputs.length; i++) {
        let progress = inputs[i].getGestureProgress(this.getId());
        if (!progress.moves) {
          progress.moves = [];
        }

        progress.moves.push({
          time: new Date().getTime(),
          x: inputs[i].current.x,
          y: inputs[i].current.y,
        });

        if (progress.length > this.maxProgressStack) {
          progress.moves.shift();
        }
      }
    }

    return null;
  }

  /* move*/

  /**
   * Determines if the input's history validates a swipe motion.
   * Determines if it did not come to a complete stop (maxRestTime), and if it
   * had enough of a velocity to be considered (ESCAPE_VELOCITY).
   * @param {Array} inputs - The array of Inputs on the screen
   * @return {null|Object} - null if the gesture is not to be emitted,
   *  Object with information otherwise.
   */
  end(inputs) {
    if (this.numInputs === inputs.length) {
      let output = {
        data: [],
      };

      for (var i = 0; i < inputs.length; i++) {
        // Determine if all input events are on the 'end' event.
        if (inputs[i].current.type !== 'end') {
          return;
        }

        let progress = inputs[i].getGestureProgress(this.getId());
        if (progress.moves && progress.moves.length > 2) {
          // CHECK : Return if the input has not moved in maxRestTime ms.

          let currentMove = progress.moves.pop();
          if ((new Date().getTime()) - currentMove.time > this.maxRestTime) {
            return null;
          }

          let lastMove;
          let index = progress.moves.length - 1;

          /* Date is unreliable, so we retrieve the last move event where
           the time is not the same. */
          while (index !== -1) {
            if (progress.moves[index].time !== currentMove.time) {
              lastMove = progress.moves[index];
              break;
            }

            index--;
          }

          /* If the date is REALLY unreliable, we apply a time distortion
           to the last event.
           */
          if (!lastMove) {
            lastMove = progress.moves.pop();
            lastMove.time += this.timeDistortion;
          }

          var velocity = util.getVelocity(lastMove.x, lastMove.y, lastMove.time,
            currentMove.x, currentMove.y, currentMove.time);

          output.data[i] = {
            velocity: velocity,
            distance: util.distanceBetweenTwoPoints(lastMove.x, currentMove.x, lastMove.y, currentMove.y),
            duration:  currentMove.time - lastMove.time,
            currentDirection: util.getAngle(
              lastMove.x,
              lastMove.y,
              currentMove.x,
              currentMove.y),
          };
        }
      }

      for (var i = 0; i < output.data.length; i++) {
        if (velocity < this.escapeVelocity) {
          return null;
        }
      }

      if (output.data.length > 0) {
        return output;
      }
    }

    return null;
  }

  /* end*/
}

module.exports = Swipe;

},{"./../core/classes/Gesture.js":6,"./../core/util.js":13}],18:[function(require,module,exports){
/**
 * @file Tap.js
 * Contains the Tap class
 */

const Gesture = require('./../core/classes/Gesture.js');
const util    = require('./../core/util.js');

const DEFAULT_MIN_DELAY_MS = 0;
const DEFAULT_MAX_DELAY_MS = 300;
const DEFAULT_INPUTS = 1;
const DEFAULT_MOVE_PX_TOLERANCE = 10;

/**
 * A Tap is defined as a touchstart to touchend event in quick succession.
 * @class Tap
 */
class Tap extends Gesture {
  /**
   * Constructor function for the Tap class.
   * @param {Object} [options] - The options object.
   * @param {Number} [options.minDelay=0] - The minimum delay between a
   * touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.maxDelay=300] - The maximum delay between a
   * touchstart and touchend can be configured in milliseconds.
   * @param {Number} [options.numInputs=1] - Number of inputs for Tap gesture.
   * @param {Number} [options.tolerance=10] - The tolerance in pixels
   *  a user can move.
   */
  constructor(options = {}) {
    super();

    /**
     * The type of the Gesture.
     * @type {String}
     */
    this.type = 'tap';

    /**
     * The minimum amount between a touchstart and a touchend can be configured
     * in milliseconds. The minimum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     * @type {Number}
     */
    this.minDelay = options.minDelay || DEFAULT_MIN_DELAY_MS;

    /**
     * The maximum delay between a touchstart and touchend can be configured in
     * milliseconds. The maximum delay starts to count down when the expected
     * number of inputs are on the screen, and ends when ALL inputs are off the
     * screen.
     * @type {Number}
     */
    this.maxDelay = options.maxDelay || DEFAULT_MAX_DELAY_MS;

    /**
     * The number of inputs to trigger a Tap can be variable,
     * and the maximum number being a factor of the browser.
     * @type {Number}
     */
    this.numInputs = options.numInputs || DEFAULT_INPUTS;

    /**
     * A move tolerance in pixels allows some slop between a user's start to end
     * events. This allows the Tap gesture to be triggered more easily.
     * @type {number}
     */
    this.tolerance = options.tolerance || DEFAULT_MOVE_PX_TOLERANCE;
  }

  /* constructor*/

  /**
   * Event hook for the start of a gesture. Keeps track of when the inputs
   * trigger the start event.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @return {null} - Tap does not trigger on a start event.
   */
  start(inputs) {
    if (inputs.length === this.numInputs) {
      inputs.forEach((input) => {
        let progress = input.getGestureProgress(this.type);
        progress.start = new Date().getTime();
      });
    }

    return null;
  }

  /* start*/

  /**
   * Event hook for the move of a gesture. The Tap event reaches here if the
   * user starts to move their input before an 'end' event is reached.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @param {Object} state - The state object of the current region.
   * @param {Element} element - The element associated to the binding.
   * @return {null} - Tap does not trigger on a move event.
   */
  move(inputs, state, element) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() === 'move') {
        let current = inputs[i].current;
        let previous = inputs[i].previous;
        if (!util.isWithin(
            current.x,
            current.y,
            previous.x,
            previous.y,
            this.tolerance)) {
          let type = this.type;
          inputs.forEach(function(input) {
            input.resetProgress(type);
          });

          return null;
        }
      }
    }

    return null;
  }

  /* move*/

  /**
   * Event hook for the end of a gesture.
   * Determines if this the tap event can be fired if the delay and tolerance
   * constraints are met. Also waits for all of the inputs to be off the screen
   * before determining if the gesture is triggered.
   * @param {Array} inputs - The array of Inputs on the screen.
   * @return {null|Object} - null if the gesture is not to be emitted,
   * Object with information otherwise. Returns the interval time between start
   * and end events.
   */
  end(inputs) {
    if (inputs.length !== this.numInputs) {
      return null;
    }

    let startTime = Number.MAX_VALUE;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].getCurrentEventType() !== 'end') {
        return null;
      }

      let progress = inputs[i].getGestureProgress(this.type);
      if (!progress.start) {
        return null;
      }

      // Find the most recent input's startTime
      if (progress.start < startTime) {
        startTime = progress.start;
      }
    }

    let interval = new Date().getTime() - startTime;
    if ((this.minDelay <= interval) && (this.maxDelay >= interval)) {
      return {
        interval: interval,
      };
    } else {
      let type = this.type;
      inputs.forEach(function(input) {
        input.resetProgress(type);
      });

      return null;
    }
  }

  /* end*/
}

module.exports = Tap;

},{"./../core/classes/Gesture.js":6,"./../core/util.js":13}]},{},[1])(1)
});
