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

    test('Accepts delays and number of taps as options parameters', () => {
      const tap = new Tap(null, null, {
        maxDelay:  2000,
        minDelay:  500,
        numTaps:   2,
        tolerance: 42,
      });
      expect(tap.maxDelay).toEqual(2000);
      expect(tap.minDelay).toEqual(500);
      expect(tap.numTaps).toEqual(2);
      expect(tap.tolerance).toEqual(42);
    });
  });

  describe('end(state)', () => {
    const start_time = 1000;
    const element = document.createElement('div');
    document.body.appendChild(element);

    let handler = null;
    let state = null;
    let real_Date_now = null;

    function add_event(identifier, phase, x, y, time_offset = 0) {
      Date.now = () => start_time + time_offset;
      const event = new PointerEvent(
        identifier, element,
        PointerEvent[phase],
        x, y,
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
      state = null;  // Just to make sure there's no cross-contamination
    });

    beforeEach(() => {
      Date.now = () => start_time;
      handler = jest.fn();
      state = new State(element);
    });

    describe('Return Value', () => {
      test('Returns the ended point position for a single tap', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   1, 2);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({ x: 1, y: 2 });
      });

      test('Return object includes centroid point object', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   1, 2);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({
          centroid: new Point2D(1, 2),
        });
      });

      test('Returns centroid of end points', () => {
        add_event(0, 'start', 0,  0);
        add_event(1, 'start', 0,  0);
        add_event(0, 'end',   10, 100);
        add_event(1, 'end',   20, 200);
        const tap = new Tap(element, handler, {
          numTaps:   2,
          tolerance: 500,
        });
        expect(tap.end(state)).toMatchObject({ x: 15, y: 150 });
      });
    });

    describe('Accepts', () => {
      test('Correct number of taps', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('Input travel is inside tolerance', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4);
        const tap = new Tap(element, handler, {
          numTaps:   1,
          tolerance: 100,  // expected distance is 5
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('Input travel tolerance bound is inclusive', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4);
        const tap = new Tap(element, handler, {
          numTaps:   1,
          tolerance: 5,  // expected distance is 5
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('Tap time is between minDelay and maxDelay', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4, 150);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          minDelay: 100,
          maxDelay: 200,
        });
        expect(tap.end(state)).toMatchObject({ x: 3, y: 4 });
      });

      test('minDelay and maxDelay bounds are inclusive', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4, 150);
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
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4);
        const tap = new Tap(element, handler, { numTaps: 2 });
        expect(tap.end(state)).toBeNull();
      });

      test('Too many taps', () => {
        add_event(0, 'start', 0,  0);
        add_event(1, 'start', 0,  0);
        add_event(0, 'end',   10, 100);
        add_event(1, 'end',   20, 200);
        const tap = new Tap(element, handler, { numTaps: 1 });
        expect(tap.end(state)).toBeNull();
      });

      test('Input travel is outside tolerance', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4);
        const tap = new Tap(element, handler, {
          numTaps:   1,
          tolerance: 4.9999,  // expected distance is 5
        });
        expect(tap.end(state)).toBeNull();
      });

      test('Tap time is less than minDelay', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4, 150);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          minDelay: 151,
        });
        expect(tap.end(state)).toBeNull();
      });

      test('Tap time is greater than maxDelay', () => {
        add_event(0, 'start', 0, 0);
        add_event(0, 'end',   3, 4, 150);
        const tap = new Tap(element, handler, {
          numTaps:  1,
          maxDelay: 149,
        });
        expect(tap.end(state)).toBeNull();
      });
    });

    describe('Miscellaneous', () => {
      test('Keeps track of ended inputs', () => {
        // The state will have its ended inputs cleared, we need to make sure
        // that doesn't affect Taps.
        const tap = new Tap(element, handler, {
          numTaps:  2,
          maxDelay: 250,
        });

        add_event(0, 'start', 0, 0);
        add_event(1, 'start', 0, 0, 100);
        add_event(0, 'end',   2, 4, 150);

        expect(tap.end(state)).toBeNull();
        state.clearEndedInputs();

        add_event(1, 'end', 4, 6, 200);
        expect(tap.end(state)).toMatchObject({ x: 3, y: 5 });
      });

      test('Inputs can only be used once for a tap', () => {
        const tap = new Tap(element, handler, {
          numTaps:  2,
          maxDelay: 250,
        });

        add_event(0, 'start', 0, 0);
        add_event(1, 'start', 0, 0, 100);
        add_event(0, 'end',   2, 4, 150);
        add_event(1, 'end',   4, 6, 200);

        expect(tap.end(state)).toMatchObject({ x: 3, y: 5 });
        state.clearEndedInputs();

        add_event(2, 'start', 0, 0, 250);
        add_event(2, 'end',   0, 0, 300);

        expect(tap.end(state)).toBeNull();
      });

      test('Inputs that took too long are discarded', () => {
        const tap = new Tap(element, handler, {
          numTaps:   2,
          maxDelay:  250,
          maxRetain: 200,
          tolerance: 10,
        });

        add_event(0, 'start', 0,   0);
        add_event(1, 'start', 0,   0,   100);
        add_event(0, 'end',   200, 400, 150);

        expect(tap.end(state)).toBeNull();
        state.clearEndedInputs();

        add_event(1, 'end',   4,   6,   200);

        // Should fail because input 0 traveled too far
        expect(tap.end(state)).toBeNull();
        state.clearEndedInputs();

        add_event(2, 'start', 0,   0,   250);
        add_event(2, 'end',   0,   0,   375);

        // input 0 should now be cleared
        expect(tap.end(state)).toMatchObject({ x: 2, y: 3 });
      });

      test('Inputs that were too short are ignored', () => {
        const tap = new Tap(element, handler, {
          numTaps:   2,
          minDelay:  250,
          tolerance: 10,
        });

        add_event(0, 'start', 0,   0);
        add_event(1, 'start', 0,   0, 200);
        add_event(2, 'start', 0,   0, 200);
        add_event(0, 'end',   4,   6, 300);

        // Should fail because of insufficient ended taps
        expect(tap.end(state)).toBeNull();
        expect(tap.taps.length).toBe(1);
        state.clearEndedInputs();

        add_event(1, 'end',   1,   2,   400);

        // Should fail because input 1 didn't take long enough
        expect(tap.end(state)).toBeNull();
        expect(tap.taps.length).toBe(1);
        state.clearEndedInputs();

        add_event(2, 'end',   0,   0,   500);

        // input 1 should now be cleared, input 2 should be recognized
        expect(tap.end(state)).toMatchObject({ x: 2, y: 3 });
      });
    });
  });
});

