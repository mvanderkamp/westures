'use strict';

/**
 * @file Gesture.js
 * Tests Gesture class
 */
import Gesture from './../../src/gestures/Gesture.js';

/** @test {Gesture} */
describe('Gesture', function() {
  it('should be instantiated', function() {
    expect(Gesture).to.not.equal(null);
  });
});

/** @test {Gesture.getType} */
describe('Gesture.getType', function() {
  it('should return null for a generic gesture', function() {
    let _gesture = new Gesture();
    expect(_gesture.getType()).to.equal(null);
  });
});
