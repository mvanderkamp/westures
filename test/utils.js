/**
 * @file utils.js
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
import Gesture from './../src/gestures/Gesture.js';
import Tap from './../src/gestures/Tap.js';
import util from './../src/core/util.js';

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

describe('util.isValidGesture', function () {
  it('should return true for a valid key of a gesture', function () {
    expect(util.isValidGesture('tap')).to.be.true;
  });

  it('should return false for an invalid key of a gesture ', function () {
    expect(util.isValidGesture('foobar')).to.be.false;
  });

  it('should return true for a valid gesture object', function () {
    expect(util.isValidGesture(new Gesture())).to.be.true;
    expect(util.isValidGesture(new Tap())).to.be.true;
  });

  it('should return false for an invalid gesture object', function () {
    expect(util.isValidGesture({})).to.be.false;
  });

  it('should return false for an invalid gesture object', function () {
    expect(util.isValidGesture({})).to.be.false;
  });

});

describe('util.normalizeEvent', function () {
  it('should expect to emit start', function () {
    expect(util.normalizeEvent('mousedown')).to.equal('start');
    expect(util.normalizeEvent('touchstart')).to.equal('start');
  });

  it('should expect to emit move', function () {
    expect(util.normalizeEvent('mousemove')).to.equal('move');
    expect(util.normalizeEvent('touchmove')).to.equal('move');
  });

  it('should expect to emit end', function () {
    expect(util.normalizeEvent('mouseup')).to.equal('end');
    expect(util.normalizeEvent('touchend')).to.equal('end');
  });

  it('should expect to emit null for unknown events', function () {
    expect(util.normalizeEvent('foobar')).to.be.null;
  });
});
