/*
 * Tests Rotate class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Rotate = require('src/Rotate.js');
const { Point2D, angularDifference } = require('../core');
const _ = require('underscore');

let element = null;
let handler = null;

beforeAll(() => {
  element = document.createElement('div');
  document.body.appendChild(element);
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Rotate', () => {
  describe('constructor', () => {
    test('Returns a Rotate object', () => {
      expect(new Rotate()).toBeInstanceOf(Rotate);
    });
  });

  describe('phase hooks', () => {
    let rotate = null;
    let state = null;
    let point1 = null;
    let point2 = null;
    let point3 = null;
    let angles = null;
    let move_state = null;
    let move_angles = null;

    beforeAll(() => {
      point1 = new Point2D(5, 5);
      point2 = new Point2D(2, 1);
      point3 = new Point2D(4, 4);

      let activePoints = [point1, point2];
      let centroid = Point2D.centroid(activePoints);
      state = { centroid, activePoints };
      angles = centroid.anglesTo(activePoints);

      activePoints = [point1, point3];
      centroid = Point2D.centroid(activePoints);
      move_state = { activePoints, centroid };
      move_angles = centroid.anglesTo(activePoints);
    });

    beforeEach(() => {
      rotate = new Rotate(element, handler, { applySmoothing: false });
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(rotate.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('Returns the change in angle from the previous emit', () => {
        const deltas = _.zip(angles, move_angles)
          .map(([angle, move_angle]) => {
            return angularDifference(move_angle, angle);
          });
        const sum = deltas.reduce((total, current) => total + current);
        const expected = sum / angles.length;

        expect(rotate.start(state)).toBeFalsy();
        expect(rotate.move(move_state).rotation).toBeCloseTo(expected);
      });

      test('Returns a smoothed ratio when applySmoothing is true', () => {
        rotate = new Rotate(element, handler, { applySmoothing: true });
        const deltas = _.zip(angles, move_angles)
          .map(([angle, move_angle]) => {
            return angularDifference(move_angle, angle);
          });
        const sum = deltas.reduce((total, current) => total + current);
        const expected = (sum / angles.length) / 2;

        expect(rotate.start(state)).toBeFalsy();
        expect(rotate.move(move_state).rotation).toBeCloseTo(expected);
      });
    });

    describe('end(state)', () => {
      test('Returns null', () => {
        expect(rotate.end(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('Returns null', () => {
        expect(rotate.cancel(state)).toBeFalsy();
      });
    });
  });
});

