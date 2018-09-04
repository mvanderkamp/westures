'use strict';

const State   = require('./../../../src/core/classes/State.js');
const Gesture = require('./../../../src/core/classes/Gesture.js');

/** @test {State} */
describe('State', function() {
  let state = new State();
  test('should be instantiated', function() {
    expect(state).toBeTruthy();
  });

  test('should have no inputs', function() {
    expect(state.inputs.length).toBe(0);
  });

  test('should have no bindings', function() {
    expect(state.bindings.length).toEqual(0);
  });

  test('should have instances of the 6 default gestures', function() {
    let gestures = ['expand', 'pan', 'pinch', 'rotate', 'swipe', 'tap'];
    for (let i = 0; i < state.registeredGestures.length; i++) {
      expect(gestures.indexOf(state.registeredGestures[i].type))
        .not.toBe(-1);
    }
  });
});

/** @test {State.addBinding} */
describe('State.addBinding', function() {
  test('should add a binding to a registered gesture', function() {
    let state = new State();
    state.addBinding(document.body, 'tap', function() {
    }, false, false);

    expect(state.bindings.length).toEqual(1);
  });

  test('should add a binding to a gesture instance', function() {
    let state = new State();
    state.addBinding(document.body, new Gesture(), function() {
    }, false, false);

    expect(state.bindings.length).toEqual(1);
  });

  test('should not add a binding to a non-registered gesture', function() {
    expect(function() {
      let state = new State();
      state.addBinding(document.body, 'foobar', function() {
      }, false, false);
    }).toThrow('Parameter foobar is not a registered gesture');
  });

  test('should not add a binding to an object not of the Gesture type',
    function() {
      expect(function() {
        let state = new State();
        state.addBinding(document.body, {}, function() {
        }, false, false);
      }).toThrow('Parameter for the gesture is not of a Gesture type');
    });
});

/** @test {State.retrieveBindings} */
describe('State.retrieveBindings', function() {
  let state = new State();
  state.addBinding(document.body, 'tap', function() {
  }, false, false);

  test('should retrieve no bindings for elements without any', function() {
    expect(state.retrieveBindingsByElement(document).length)
      .toBe(0);
  });

  test('should retrieve bindings for elements that are bound', function() {
    expect(state.retrieveBindingsByElement(document.body).length)
      .toBeGreaterThan(0);
  });
});
