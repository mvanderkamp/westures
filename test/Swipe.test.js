/*
 * Tests Swipe class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Swipe = require('src/Swipe.js');
const { Point2D } = require('core');

let element = null;
let handler = null;
let last_time = 0;

beforeAll(() => {
  element = document.createElement('div');
  document.body.appendChild(element);

  // increase time by 10 every time this is called
  jest.spyOn(global.Date, 'now')
    .mockImplementation(() => {
      last_time += 10;
      return last_time;
    });
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Swipe', () => {
  describe('constructor', () => {
    test('Returns a Swipe object', () => {
      expect(new Swipe()).toBeInstanceOf(Swipe);
    });
  });

  describe('phase hooks', () => {
    let swipe = null;
    let state = null;
    let point = null;

    beforeAll(() => {
      point = new Point2D(0, 0);
      state = { active: [point], centroid: point };
    });

    beforeEach(() => {
      swipe = new Swipe(element, handler);
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(swipe.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('Returns null', () => {
        expect(swipe.start(state)).toBeFalsy();
        expect(swipe.move(state)).toBeFalsy();
      });

      test('Only keeps up to PROGRESS_STACK_SIZE moves', () => {
        expect(swipe.start(state)).toBeFalsy();
        // at first the moves list grows
        for (let i = 0; i < 7; ++i) {
          point = new Point2D(i, i);
          state = { active: [point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
          expect(swipe.moves.length).toBe(i + 1);
          expect(swipe.moves[0].point).toMatchObject(new Point2D(0, 0));
          expect(swipe.moves[swipe.moves.length - 1].point).toBe(point);
        }
        // from now on moves length is limited to 7
        for (let i = 7; i < 12; ++i) {
          point = new Point2D(i, i);
          state = { active: [point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
          expect(swipe.moves.length).toBe(7);
          // items are removed from the front
          expect(swipe.moves[0].point).toMatchObject(new Point2D(i - 6, i - 6));
          expect(swipe.moves[6].point).toBe(point);
        }
      });
    });

    describe('end(state)', () => {
      test('returns null if less than 7 moves', () => {
        expect(swipe.start(state)).toBeFalsy();
        for (let i = 0; i < 6; ++i) {
          point = new Point2D(i, i);
          state = { active: [point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
        }
        state = {
          active:   [],
          centroid: null,
        };
        expect(swipe.end(state)).toBeFalsy();
      });

      test('returns null if there are still active points', () => {
        expect(swipe.start(state)).toBeFalsy();
        const stable_point = new Point2D(0, 0);
        state = { active: [point, stable_point], centroid: point };
        expect(swipe.start(state)).toBeFalsy();
        for (let i = 0; i < 10; ++i) {
          point = new Point2D(i, i);
          state = { active: [point, stable_point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
        }
        state = {
          active:   [stable_point],
          centroid: stable_point,
        };
        expect(swipe.end(state)).toBeFalsy();
      });

      test('returns SwipeData when valid', () => {
        expect(swipe.start(state)).toBeFalsy();
        for (let i = 1; i < 10; ++i) {
          point = new Point2D(i, i);
          state = { active: [point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
        }
        state = {
          active:   [],
          centroid: null,
        };
        const expected = {
          point:     point,
          centroid:  point,
          time:      last_time,
          direction: Math.atan2(1, 1),  // proceeding perfectly at 45 degrees
          velocity:  Math.sqrt(2) / 11,
        };
        expect(swipe.end(state)).toMatchObject(expected);
      });

      test('Uses cached result if last point does not swipe', () => {
        // More specifically, if a swipe would have been detected if not for a
        // final touch point hanging around too long, but that touch point is
        // released before resulting in a new swipe and without holding around
        // too long, the saved result is used. This is to make sure that
        // multi-touch swipes work even if not all the points are removed at
        // once.
        expect(swipe.start(state)).toBeFalsy();
        const stable_point = new Point2D(0, 0);
        state = { active: [point, stable_point], centroid: point };
        expect(swipe.start(state)).toBeFalsy();
        for (let i = 1; i < 10; ++i) {
          point = new Point2D(i, i);
          // we'll cheat a little bit and pretend stable_point doesn't affect
          // the centroid, so that the math will be easier to predict
          state = { active: [point, stable_point], centroid: point };
          expect(swipe.move(state)).toBeFalsy();
        }
        state = {
          active:   [stable_point],
          centroid: stable_point,
        };
        expect(swipe.end(state)).toBeFalsy();

        // Now this end should work
        state = {
          active:   [],
          centroid: null,
        };
        const expected = {
          point:     point,
          centroid:  point,
          time:      last_time,
          direction: Math.atan2(1, 1),  // proceeding perfectly at 45 degrees
          velocity:  Math.sqrt(2) / 11,
        };
        expect(swipe.end(state)).toMatchObject(expected);
      });
    });

    describe('cancel(state)', () => {
      test('Returns null', () => {
        expect(swipe.cancel(state)).toBeFalsy();
      });
    });
  });

  describe('static methods', () => {
    describe('validate(data)', () => {
      test('null if data is null', () => {
        expect(Swipe.validate(null)).toBeNull();
      });

      test('null if too old', () => {
        const data = { time: Date.now() - 1000 };
        expect(Swipe.validate(data)).toBeNull();
      });

      test('returns data back if valid', () => {
        const data = { time: Date.now(), foo: 'bar' };
        expect(Swipe.validate(data)).toBe(data);
      });
    });

    describe('velocity(start, end)', () => {
      test('Calculates dx/dt', () => {
        const start = {
          point: new Point2D(0, 0),
          time:  0,
        };
        const end = {
          point: new Point2D(3, 4),
          time:  9,  // will get +1 to avoid div by zero
        };
        expect(Swipe.velocity(start, end)).toBeCloseTo(0.5);
      });
    });

    describe('calc_velocity(moves, vlim)', () => {
      test('Given vlim of 0, reports 0', () => {
        const moves = [
          { point: new Point2D(3, 4), time: 0 },
        ];
        expect(Swipe.calc_velocity(moves, 0)).toBe(0);
      });

      test('Given vlim of 1, reports velocity of that move', () => {
        const moves = [
          { point: new Point2D(0, 0), time: 0 },
          { point: new Point2D(3, 4), time: 9 },
        ];
        const vlim = 1;
        expect(Swipe.calc_velocity(moves, vlim)).toBeCloseTo(0.5);
      });

      test('Given vlim >1, reports max velocity', () => {
        let moves = [
          { point: new Point2D(0, 0), time: 0 },
          { point: new Point2D(3, 4), time: 9 },  // 0.5
          { point: new Point2D(6, 8), time: 28 },  // 0.25
        ];
        const vlim = 2;
        expect(Swipe.calc_velocity(moves, vlim)).toBeCloseTo(0.5);
        moves = [
          { point: new Point2D(0, 0), time: 0 },
          { point: new Point2D(3, 4), time: 9 },  // 0.5
          { point: new Point2D(6, 8), time: 13 },  // 1
        ];
        expect(Swipe.calc_velocity(moves, vlim)).toBeCloseTo(1);
      });
    });

    describe('calc_angle(moves, vlim)', () => {
      test('Given vlim of 0, reports NaN (div by zero)', () => {
        const moves = [
          { point: new Point2D(3, 4) },
        ];
        expect(Swipe.calc_angle(moves, 0)).toBeNaN();
      });

      test('Given vlim of 1, calculates angle to second point', () => {
        const moves = [
          { point: new Point2D(0, 0) },
          { point: new Point2D(3, 4) },
        ];
        expect(Swipe.calc_angle(moves, 1)).toBeCloseTo(Math.atan2(4, 3));
      });

      test('Given vlim >1, calculates circular mean to last point', () => {
        const moves = [
          { point: new Point2D(0, 0) },
          { point: new Point2D(1, 2) },
          { point: new Point2D(3, 4) },
        ];
        const vlim = 2;
        const expected = (Math.atan2(4, 3) + Math.atan2(2, 2)) / vlim;
        expect(Swipe.calc_angle(moves, vlim)).toBeCloseTo(expected);
      });
    });
  });
});
