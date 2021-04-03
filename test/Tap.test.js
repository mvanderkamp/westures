/*
 * Tests Tap class
 */

/* global expect, describe, test, beforeEach, beforeAll, afterEach, jest */

'use strict';

const Tap = require('src/Tap.js');
const { State, Point2D } = require('core');
const PointerEvent = require('core/test/PointerEvent.js');

describe('Tap', () => {
  describe('constructor', () => {
    test('Returns a Tap object', () => {
      expect(new Tap()).toBeInstanceOf(Tap);
    });

    test('Accepts delay and number of taps as options parameters', () => {
      const tap = new Tap(null, null, {
        maxDelay:  2000,
        numTaps:   2,
      });
      expect(tap.maxDelay).toEqual(2000);
      expect(tap.numTaps).toEqual(2);
    });
  });

  describe('end(state)', () => {
    const start_time = 1000;
    const element = document.createElement('div');
    document.body.appendChild(element);

    let handler = null;
    let start_event = null;
    let state = null;
    let real_Date_now = null;

    beforeAll(() => {
      // Need to mock this out so tests will be deterministic (not reliant on
      // how fast the test happens to run, etc).
      real_Date_now = Date.now;
    });

    afterEach(() => {
      Date.now = real_Date_now;
    });

    beforeEach(() => {
      Date.now = () => start_time;
      handler = jest.fn();
      start_event = new PointerEvent(0, element, PointerEvent.start, 0, 0);
      state = new State(element);
      state.updateAllInputs(start_event);
    });

    test('Returns the ended point position for a single tap', () => {
      const event = new PointerEvent(0, element, PointerEvent.end, 1, 2);
      state.updateAllInputs(event);

      const tap = new Tap(element, handler, { numTaps: 1 });
      expect(tap.end(state)).toMatchObject({ x: 1, y: 2 });
    });

    test('Return object includes centroid as well as x, y', () => {
      const event = new PointerEvent(0, element, PointerEvent.end, 1, 2);
      state.updateAllInputs(event);

      const tap = new Tap(element, handler, { numTaps: 1 });
      expect(tap.end(state)).toMatchObject({
        centroid: new Point2D(1, 2),
        x:        1,
        y:        2,
      });
    });

    test('Returns centroid of end points', () => {
      const start_2 = new PointerEvent(1, element, PointerEvent.start, 0, 0);
      state.updateAllInputs(start_2);
      const event = new PointerEvent(0, element, PointerEvent.end, 10, 100);
      state.updateAllInputs(event);
      const event_2 = new PointerEvent(1, element, PointerEvent.end, 20, 200);
      state.updateAllInputs(event_2);

      const tap = new Tap(element, handler, {
        numTaps:   2,
        tolerance: 500,
      });
      expect(tap.end(state)).toMatchObject({ x: 15, y: 150 });
    });

    test('Rejects too few taps', () => {
      const event = new PointerEvent(0, element, PointerEvent.end, 1, 2);
      state.updateAllInputs(event);

      const tap = new Tap(element, handler, { numTaps: 2 });
      expect(tap.end(state)).toBeNull();
    });

    test('Rejects too many taps', () => {
      const start_2 = new PointerEvent(1, element, PointerEvent.start, 20, 20);
      state.updateAllInputs(start_2);
      const event = new PointerEvent(0, element, PointerEvent.end, 1, 2);
      state.updateAllInputs(event);
      const event_2 = new PointerEvent(1, element, PointerEvent.end, 20, 20);
      state.updateAllInputs(event_2);

      const tap = new Tap(element, handler, { numTaps: 1 });
      expect(tap.end(state)).toBeNull();
    });

    test('Rejects if input travel is outside tolerance', () => {
      const event = new PointerEvent(0, element, PointerEvent.end, 3, 4);
      state.updateAllInputs(event);

      const tap = new Tap(element, handler, {
        numTaps:   1,
        tolerance: 4.9999,  // expected distance is 5
      });
      expect(tap.end(state)).toBeNull();
    });

    test('Accepts if input travel is inside tolerance', () => {
      const event = new PointerEvent(0, element, PointerEvent.end, 3, 4);
      state.updateAllInputs(event);

      const tap = new Tap(element, handler, {
        numTaps:   1,
        tolerance: 5,  // expected distance is 5
      });
      expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
    });
  });
});

