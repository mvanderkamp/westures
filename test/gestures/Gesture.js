/**
 * @file Gesture.js
 * Tests Gesture class
 */
import Gesture from './../../src/gestures/Gesture.js';

describe('Gesture', function () {
  it('should be instantiated', function () {
    expect(Gesture).to.not.equal(null);
  });
});

describe('Gesture.getType()', function () {
  it('should return null for a generic gesture', function () {
    var _gesture = new Gesture();
    expect(_gesture.getType()).to.equal(null);
  });
});

