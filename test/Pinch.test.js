/*
 * Tests Pinch class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Pinch = require('src/Pinch.js');
const { Point2D } = require('../core');

let element = null;
let handler = null;

beforeAll(() => {
  element = document.createElement('div');
  document.body.appendChild(element);
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Pinch', () => {
  describe('constructor', () => {
    test('Returns a Pinch object', () => {
      expect(new Pinch()).toBeInstanceOf(Pinch);
    });
  });

  describe('phase hooks', () => {
    let pinch = null;
    let state = null;
    let point1 = null;
    let point2 = null;
    let point3 = null;
    let distance = null;
    let move_state = null;
    let move_distance = null;

    beforeAll(() => {
      point1 = new Point2D(5, 5);
      point2 = new Point2D(2, 1);
      point3 = new Point2D(4, 4);

      let activePoints = [point1, point2];
      let centroid = Point2D.centroid(activePoints);
      state = { centroid, activePoints };
      distance = centroid.averageDistanceTo(activePoints);

      activePoints = [point1, point3];
      centroid = Point2D.centroid(activePoints);
      move_state = { activePoints, centroid };
      move_distance = centroid.averageDistanceTo(activePoints);
    });

    beforeEach(() => {
      pinch = new Pinch(element, handler, { applySmoothing: false });
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(pinch.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('Returns the distance ratio from the previous emit', () => {
        const expected = move_distance / distance;

        expect(pinch.start(state)).toBeFalsy();
        expect(pinch.move(move_state).scale).toBeCloseTo(expected);
      });

      test('Returns a smoothed ratio when applySmoothing is true', () => {
        pinch = new Pinch(element, handler, { applySmoothing: true });
        const expected = (1 + move_distance / distance) / 2;

        expect(pinch.start(state)).toBeFalsy();
        expect(pinch.move(move_state).scale).toBeCloseTo(expected);
      });
    });

    describe('end(state)', () => {
      test('Returns null', () => {
        expect(pinch.end(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('Returns null', () => {
        expect(pinch.cancel(state)).toBeFalsy();
      });
    });
  });

  describe('other prototype methods', () => {
    let point = null;
    let state = null;
    let pinch = null;

    beforeAll(() => {
      point = new Point2D(42, 117);
      state = {
        centroid:     point,
        activePoints: [point],
      };
    });

    beforeEach(() => {
      pinch = new Pinch(element, handler);
    });

    describe('restart(state)', () => {
      test(
        'Resets the previous value as average distance to the active points',
        () => {
          pinch.restart(state);
          expect(pinch.previous).toBe(0);

          state.activePoints = [new Point2D(45, 121)];
          const expected = state.centroid.averageDistanceTo(state.activePoints);
          pinch.restart(state);
          expect(pinch.previous).toBe(expected);
        },
      );
    });
  });
});

