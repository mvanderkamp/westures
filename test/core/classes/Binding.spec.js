'use strict';

/**
 * @file Binding.js
 * Tests Binding class
 */
const Binding = require('./../../../src/core/classes/Binding.js');
const Gesture = require('./../../../src/core/classes/Gesture.js');

/** @test {Binding} */
describe('Binding', function() {
  let gesture = new Gesture();
  let element = document.createElement('div');
  let binding = new Binding(element, gesture, function() {}, false, false);

  test('should be instantiated', function() {
    expect(Binding).toBeTruthy();
  });

  test('should have an element as a member', function() {
    expect(binding.element).toBe(element);
  });

  test('should have an Gesture as a member', function() {
    expect(binding.gesture).toBeInstanceOf(Gesture);
  });

  test('should have an function as a member', function() {
    expect(binding.handler).toBeInstanceOf(Function);
  });
});
