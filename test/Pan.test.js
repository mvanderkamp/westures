/*
 * Tests Pan class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Pan = require('src/Pan.js');
const { Point2D } = require('westures-core');

let element = null;
let handler = null;

beforeAll(() => {
  element = document.createElement('div');
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Pan', () => {
  describe('constructor', () => {
    test('Returns a Pan object', () => {
      expect(new Pan()).toBeInstanceOf(Pan);
    });
  });

  describe('phase hooks', () => {
    let pan = null;
    let state = null;
    const options = { applySmoothing: false };

    beforeAll(() => {
      state = {
        centroid: new Point2D(42, 117),
      };
    });

    beforeEach(() => {
      pan = new Pan(element, handler, options);
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(pan.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('Returns the change vector', () => {
        const change = new Point2D(12, -13);
        const move_state = {
          centroid: state.centroid.plus(change),
        };

        expect(pan.start(state)).toBeFalsy();
        expect(pan.move(move_state).translation).toMatchObject(change);
      });

      test('Returns a smoothed change vector, if using smoothing', () => {
        const change = new Point2D(12, -13);
        const move_state = {
          centroid: state.centroid.plus(change),
        };
        const options = { applySmoothing: true };
        const expected = Point2D.centroid([change, new Point2D(0, 0)]);

        pan = new Pan(element, handler, options);
        expect(pan.start(state)).toBeFalsy();
        expect(pan.move(move_state).translation).toMatchObject(expected);
      });
    });

    describe('end(state)', () => {
      test('Returns null', () => {
        expect(pan.end(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('Returns null', () => {
        expect(pan.cancel(state)).toBeFalsy();
      });
    });
  });

  describe('other prototype methods', () => {
    let pan = null;
    beforeEach(() => {
      pan = new Pan(element, handler);
    });

    describe('restart(state)', () => {
      const state = {
        centroid: new Point2D(42, 117),
      };

      test('Resets the previous value', () => {
        pan.restart(state);
        expect(pan.previous).toBe(state.centroid);
      });
    });
  });
});

