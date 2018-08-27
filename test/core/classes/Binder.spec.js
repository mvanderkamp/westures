'use strict';

/**
 * @file Binder.js
 * Tests Binder class
 */
const Binder = require('./../../../src/core/classes/Binder.js');
const State  = require('./../../../src/core/classes/State.js');

/** @test {Binder} */
describe('Binder', function() {
  it('should be instantiated', function() {
    expect(Binder).to.not.equal(null);
  });

  it('should return a new object with a valid element parameter', function() {
    let myState = new State();
    let myBinder = new Binder(document.body, false, myState);
    expect(myBinder).to.not.equal.null;
    expect(myBinder.element).to.equal(document.body);
  });

  it(`should return a chainable object with all of the
   current registered gestures`, function() {
    let myState = new State();
    let myBinder = new Binder(document.body, false, myState);
    let gestures = Object.keys(myState.registeredGestures);

    for (let key in myBinder) {
      if (key !== 'element') {
        expect(gestures.indexOf(key) >= 0).to.be.true;
      }
    }
  });
});
