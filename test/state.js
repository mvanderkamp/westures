import state from './../src/core/state.js';
import Tap from './../src/gestures/Tap.js';
import Gesture from './../src/gestures/Gesture.js';

describe('state', function () {
  it('should be instantiated', function () {
    expect(state).to.not.equal(null);
  });
});

describe('state.addBinding', function () {
  beforeEach(function () {
    state.bindings = [];
  });

  it('should create a binding with a new gesture', function () {
    expect(state.bindings).to.be.empty;
    var gesture = new Gesture();
    var handler = function () {};

    var binding = state.addBinding(document.body, gesture, handler);
    expect(binding).to.not.be.null;
    expect(state.bindings).to.not.be.empty;
    expect(binding.element).to.equal(document.body);
    expect(binding.gesture).to.equal(gesture);
    expect(binding.gesture).to.not.equal(new Gesture());
    expect(binding.handler).to.equal(handler);
    expect(binding.handler).to.not.equal(function () {});

  });

  it('should create a binding with a key of an existing gesture', function () {
    expect(state.bindings).to.be.empty;
    var handler = function () {};

    var binding = state.addBinding(document.body, 'tap', handler);
    expect(binding).to.not.be.null;
    expect(state.bindings).to.not.be.empty;
    expect(binding.element).to.equal(document.body);
    expect(binding.gesture).to.equal(state.registeredGestures.tap);
    expect(binding.gesture).to.not.equal(new Gesture());
    expect(binding.handler).to.equal(handler);
    expect(binding.handler).to.not.equal(function () {});
  });

  it('should not create a binding with a key of a non-existing gesture', function () {
    expect(state.bindings).to.be.empty;
    var binding = state.addBinding(document.body, 'tapfoo', function () {});

    expect(binding).to.be.null;
    expect(state.bindings).to.be.empty;
  });

  it('should not create a binding with an invalid object', function () {
    expect(state.bindings).to.be.empty;
    var binding = state.addBinding(document.body, {}, function () {});

    expect(binding).to.be.null;
    expect(state.bindings).to.be.empty;
  });
});

//describe('state.retrieveBindings', function () {
//
//  it('should return an empty array if no bindings are associated to that element', function () {
//
//  });
//
//  it('should return an array with bindings that are a', function () {
//
//  });
//});
