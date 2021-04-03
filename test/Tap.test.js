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
    let state = null;
    let real_Date_now = null;

    function add_event(state, identifier, phase, x, y) {
      const event = new PointerEvent(
        identifier, element,
        PointerEvent[phase],
        x, y
      );
      state.updateAllInputs(event);
    }

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
      state = new State(element);
      add_event(state, 0, 'start', 0, 0);
    });

    describe('Return Value', () => {
      test('Returns the ended point position for a single tap', () => {
        add_event(state, 0, 'end', 1, 2);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({ x: 1, y: 2 });
      });

      test('Return object includes centroid point object', () => {
        add_event(state, 0, 'end', 1, 2);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({
          centroid: new Point2D(1, 2),
        });
      });

      test('Returns centroid of end points', () => {
        add_event(state, 1, 'start', 0, 0);
        add_event(state, 0, 'end', 10, 100);
        add_event(state, 1, 'end', 20, 200);
        const tap = new Tap(element, handler, {
          numTaps:   2,
          tolerance: 500,
        });
        expect(tap.end(state)).toMatchObject({ x: 15, y: 150 });
      });
    });

    describe('Accepts', () => {
      test('Correct number of taps', () => {
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('Input travel is inside tolerance', () => {
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:   1,
          tolerance: 5,  // expected distance is 5
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('Tap time is between minDelay and maxDelay', () => {
        Date.now = () => start_time + 150;
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          minDelay: 100,
          maxDelay: 200,
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('minDelay and maxDelay bounds are inclusive', () => {
        Date.now = () => start_time + 150;
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          minDelay: 150,
          maxDelay: 150,
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });
    });

    describe('Rejects', () => {
      test('Too few taps', () => {
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, { numTaps: 2 });
        expect(tap.end(state)).toBeNull();
      });

      test('Too many taps', () => {
        add_event(state, 1, 'start', 0, 0);
        add_event(state, 0, 'end', 10, 100);
        add_event(state, 1, 'end', 20, 200);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toBeNull();
      });

      test('Input travel is outside tolerance', () => {
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:   1,
          tolerance: 4.9999,  // expected distance is 5
        });
        expect(tap.end(state)).toBeNull();
      });

      test('Tap time is less than minDelay', () => {
        Date.now = () => start_time + 150;
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          minDelay: 151,
        });
        expect(tap.end(state)).toBeNull();
      });

      test('Tap time is greater than maxDelay', () => {
        Date.now = () => start_time + 150;
        add_event(state, 0, 'end', 3, 4);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          maxDelay: 149,
        });
        expect(tap.end(state)).toBeNull();
      });
    });
  });
});

