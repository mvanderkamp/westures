/*
 * Tests Pull class
 */

/* global expect, describe, test, beforeEach, jest */

'use strict';

const Pull = require('src/Pull.js');
const { Point2D } = require('core');

describe('Pull', () => {
  let centroid = null;
  let element = null;
  let expected_distance = null;
  let handler = null;
  let pivot = null;
  let state = null;

  beforeEach(() => {
    // diff x, y components to get 3rd point of 3x4x5 triangle
    pivot = new Point2D(0, 0);
    centroid = new Point2D(3, 4);

    element = document.createElement('div');
    expected_distance = 5;
    handler = jest.fn();
    state = { centroid };
  });

  describe('constructor', () => {
    test('Returns a Pull object', () => {
      expect(new Pull()).toBeInstanceOf(Pull);
    });
  });

  describe('updatePrevious()', () => {
    test('stores distance to pivot in previous', () => {
      const pull = new Pull(element, handler);
      pull.pivot = pivot;
      expect(() => pull.updatePrevious(state))
        .not.toThrow();
      expect(pull.previous).toBe(expected_distance);
    });
  });

  describe('move(state)', () => {
    test('returns null if new point within deadzoneRadius', () => {
      const pull = new Pull(element, handler, {
        deadzoneRadius: expected_distance + 1,
      });
      pull.start({ centroid: new Point2D(6, 8) });
      expect(pull.move(state)).toBeFalsy();
    });

    test('returns null if previous point within deadzoneRadius', () => {
      const pull = new Pull(element, handler, {
        deadzoneRadius: expected_distance + 1,
      });
      pull.start({ centroid });
      expect(pull.move({ centroid: new Point2D(42, 1337) })).toBeFalsy();
    });

    test('returns distance, scale, and pivot on regocnition', () => {
      const pull = new Pull(element, handler, {
        deadzoneRadius: expected_distance / 2,
      });
      pull.start({ centroid: new Point2D(6, 8) });
      const result = pull.move({ centroid });
      expect(result).toMatchObject({
        distance: expected_distance,
        pivot:    pivot,

        // scale here goes from a dist of 10 to a dist of 5, which looks like it
        // should be 0.5, but remember there is smoothing applied, so it gets
        // softened to 0.75.
        scale:    0.75,
      });
    });
  });
});

