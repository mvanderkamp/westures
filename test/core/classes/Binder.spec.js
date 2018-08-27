'use strict';

/**
 * @file Binder.js
 * Tests Binder class
 */
const Binder = require('./../../../src/core/classes/Binder.js');
const State  = require('./../../../src/core/classes/State.js');

/** @test {Binder} */
describe('Binder', function() {
  test('should be instantiated', function() {
    expect(Binder).toBeTruthy();
  });

  test('should return a new object with a valid element parameter', function() {
    let myState = new State();
    let myBinder = new Binder(document.body, false, myState);
    expect(myBinder).toBeInstanceOf(Binder);
    expect(myBinder.element).toEqual(document.body);
  });

  test(`should return a chainable object with all of the
   current registered gestures`, function() {
    let myState = new State();
    let myBinder = new Binder(document.body, false, myState);
    let gestures = Object.keys(myState.registeredGestures);

    for (let key in myBinder) {
      if (key !== 'element') {
        expect(gestures.indexOf(key) >= 0).toBe(true);
      }
    }
  });
});
