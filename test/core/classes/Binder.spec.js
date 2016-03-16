/**
 * @file Binder.js
 * Tests Binder class
 */
import Binder from './../../../src/core/classes/Binder.js';
import State from './../../../src/core/classes/State.js';

/** @test {Binder} */
describe('Binder', function () {
  it('should be instantiated', function () {
    expect(Binder).to.not.equal(null);
  });

  it('should return a new object with a valid element parameter', function () {
    var myState = new State();
    var myBinder = new Binder(document.body, false, myState);
    expect(myBinder).to.not.equal.null;
    expect(myBinder.element).to.equal(document.body);
  });

  it('should return a chainable object with all of the current registered gestures', function () {
    var myState = new State();
    var myBinder = new Binder(document.body, false, myState);
    var gestures = Object.keys(myState.registeredGestures);

    for (var key in myBinder) {
      if (key !== 'element') {
        expect(gestures.indexOf(key) >= 0).to.be.true;
      }
    }
  });

});

