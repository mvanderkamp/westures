/**
 * @file Binder.js
 * Tests Binder class
 */
import Binder from './../../../src/core/classes/Binder.js';
import state from './../../../src/core/state.js';

/** @test {Binder} */
describe('Binder', function () {
  it('should be instantiated', function () {
    expect(Binder).to.not.equal(null);
  });

  it('should return a new object with a valid element parameter', function () {
    var myBinder = new Binder(document.body);
    expect(myBinder).to.not.equal.null;
    expect(myBinder.element).to.equal(document.body);
  });

  it('should return a chainable object with all of the current registered gestures', function () {
    var myBinder = new Binder(document.body);
    var gestures = Object.keys(state.registeredGestures);

    for (var key in myBinder) {
      if (key !== 'element') {
        expect(gestures.indexOf(key) >= 0).to.be.true;
      }
    }
  });

});

