'use strict';

/**
 * @file Binding.js
 * Tests Binding class
 */
const Binding = require('../../src/core/Binding.js');
const Gesture = require('../../src/core/Gesture.js');

describe('Module exists', () => {
  expect(Binding).toBeDefined();
});

let gesture = new Gesture('dummy');
let element = document.createElement('div');

/** @test {Binding} */
describe('constructor', function() {
  let binding;

  test('Can be instantiated', () => {
    expect(() => {
      binding = new Binding(element, gesture, jest.fn(), false, false);
    }).not.toThrow();
  });

  test('Begins listening immediately', () => {
    element.dispatchEvent(new CustomEvent(gesture.id, {
      detail: 42,
    }));
    expect(binding.handler).toHaveBeenCalledTimes(1);
    expect(binding.handler.mock.calls[0][0].detail).toBe(42);
  });
});

describe('dispatch(data)', () => {
  const binding = new Binding(element, gesture, jest.fn(), false, false);

  test('Dispatches an event to the element', () => {
    binding.dispatch(43);
    expect(binding.handler).toHaveBeenCalledTimes(2);
    expect(binding.handler.mock.calls[1][0].detail).toBe(43);
  });
});

