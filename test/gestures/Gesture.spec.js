'use strict';

/**
 * @file Gesture.js
 * Tests Gesture class
 */
const Gesture = require('../../src/core/Gesture.js');

/** @test {Gesture} */
describe('Gesture', function() {
  test('should be instantiated', function() {
    expect(Gesture).toBeTruthy();
  });
});

/** @test {Gesture.getType} */
describe('Gesture.getType', function() {
  test('should return null for a generic gesture', function() {
    expect(new Gesture().type).toBeNull();
  });
});
