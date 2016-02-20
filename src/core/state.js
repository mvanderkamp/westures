
var registeredBindings = {
  tap: function () {

  }
};

var state = {
  inputs: [], //Contains current inputs (touches) on the screen
  currentTarget: null, //The element being targeted for the gesture.
  currentElement: null,
  assignees: {}, //Hash map that maps an element to the gestures it is bound to.
  initialState: [], //Current information about the initial touches.
  bindings: registeredBindings,
  /**
   * Clears the internal state/current gesture in progress.
   * @mutates inputs to []
   * @mutates initialState to []
   * @mutates currentTarget to null
   */
  clearState: function () {
  },

  addBinding: function () {
  }

};

export default state;
