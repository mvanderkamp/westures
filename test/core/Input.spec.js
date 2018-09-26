'use strict';

/**
 * @file Binding.js
 * Tests Binding class
 */
const Input     = require('../../src/core/Input.js');
const ZingEvent = require('../../src/core/ZingEvent.js');

describe('Module exists', () => {
  expect(Input).toBeDefined();
});

/** @test {Input} */
describe('constructor', function() {
  let event = document.createEvent('Event');
  let input = new Input(event, 1234);

  test('should have an initial event', function() {
    expect(input.initial).toBeInstanceOf(ZingEvent);
  });

  test('should have an current event', function() {
    expect(input.current).toBeInstanceOf(ZingEvent);
    expect(input.current).toEqual(input.current);
  });

  test('should have an previous event', function() {
    expect(input.previous).toBeInstanceOf(ZingEvent);
    expect(input.previous).toEqual(input.current);
  });
});

/** @test {Input.update} */
describe('Input.update', function() {
  let event = document.createEvent('Event');
  let input = new Input(event, 1234);

  test('should update the current event', function() {
    let newEvent = document.createEvent('MouseEvent');
    input.update(newEvent, 4321);
    expect(input.previous).not.toBe(input.current);
  });
});

/** @test {Input.getProgressOfGesture} */
describe('Input.getProgressOfGesture', function() {
  let event = document.createEvent('Event');
  let input = new Input(event, 1234);

  test('should have no progress initially', function() {
    expect(input.getProgressOfGesture('tap')).toEqual({});
  });

  test(`should have be able to store metadata in the progress object.`,
    function() {
    expect(input.getProgressOfGesture('tap')).toEqual({});
    (input.getProgressOfGesture('tap')).foo = 8;
    expect(input.getProgressOfGesture('tap').foo).toEqual(8);
  });
});

/** @test {Input.getCurrentEventType} */
describe('Input.getCurrentEventType', function() {
  test('should be null for an event it does not understand', function() {
    let event = document.createEvent('Event');
    let input = new Input(event, 1234);
    expect(input.getCurrentEventType()).toBeUndefined();
  });

  test('should not be null for an event it does understand', function() {
    const touch = { identifier: 1, clientX: 42, clientY: 43 };
    const event = {
      type: 'touchstart',
      touches: [touch],
      changedTouches: [touch],
      targetTouches: [touch],
    };
    const touchInput = new Input(event, touch.identifier);
    expect(touchInput.getCurrentEventType()).toEqual('start');
  });
});

/** @test {Input.getCurrentEventType} */
describe('Input.resetProgress', function() {
  let event = document.createEvent('Event');
  let input = new Input(event, 1234);
  test('should reset the progress of an existing progress state', function() {
    expect(input.getProgressOfGesture('tap')).toEqual({});
    (input.getProgressOfGesture('tap')).foo = 8;
    expect(input.getProgressOfGesture('tap').foo).toEqual(8);
    input.resetProgress('tap');
    expect(input.getProgressOfGesture('tap')).toEqual({});
  });
});
