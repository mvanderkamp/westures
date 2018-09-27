'use strict';

/**
 * @file Gesture.js
 * Tests Gesture class
 */
const Gesture = require('../../src/core/Gesture.js');

/** @test {Gesture} */
describe('Module exists', function() {
  expect(Gesture).toBeDefined();
});

describe('constructor', () => {
  test('Returns a new gesture of the given type', () => {
    let gesture = null;
    expect(() => gesture = new Gesture('dummy')).not.toThrow();
    expect(gesture.type).toBe('dummy');
  });

  test('Throws an exception if no type provided to constructor', function() {
    expect(() => new Gesture()).toThrow();
  });
});

