/**
 * @file utils.js
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
import Gesture from './../../src/gestures/Gesture.js';
import Tap from './../../src/gestures/Tap.js';
import util from './../../src/core/util.js';

describe('util', function () {
  it('should be instantiated', function () {
    expect(util).to.not.equal(null);
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
