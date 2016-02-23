import util from './../src/core/util.js';
import Tap from './../src/gestures/Tap.js';
/**
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
describe('util', function () {
  it('should be instantiated', function () {
    expect(util).to.not.equal(null);
  });
});

describe('util.getGestureType', function () {

  it('should return tap if the string is a valid binding', function () {
    expect(util.getGestureType('tap')).to.equal('tap');
  });

  it('should return null for an invalid string key binding', function () {
    expect(util.getGestureType('quadruple-tap')).to.be.null;
  });

  it('should return tap for a valid gesture object', function () {
    var tapGesture = new Tap();
    expect(util.getGestureType(tapGesture)).to.equal('tap');
  });

  it('should return null for an invalid object', function () {
    expect(util.getGestureType({})).to.be.null;
  });

});
