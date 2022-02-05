/*
 * Tests Swivel class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Swivel = require('src/Swivel.js');
const { Point2D } = require('../core');

let element = null;
let handler = null;

beforeAll(() => {
  element = document.createElement('div');
  element.getBoundingClientRect = jest.fn();
  element.getBoundingClientRect.mockReturnValue({
    left:   0,
    top:    0,
    width:  50,
    height: 80,
  });
  document.body.appendChild(element);
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Swivel', () => {
  describe('constructor', () => {
    test('Returns a Swivel object', () => {
      expect(new Swivel()).toBeInstanceOf(Swivel);
    });
  });

  describe('phase hooks', () => {
    let swivel = null;
    let state = null;

    beforeEach(() => {
      const options = { applySmoothing: false };
      swivel = new Swivel(element, handler, options);
      state = {
        active:   [],
        centroid: new Point2D(42, 117),
      };
    });

    describe('start(state)', () => {
      test('returns null', () => {
        expect(swivel.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('returns 0 if move somehow shows no change', () => {
        expect(swivel.start(state)).toBeFalsy();
        const expected = {
          'pivot': {
            'x': 25,
            'y': 40,
          },
          'rotation': 0,
        };
        // Passing the same state back in!
        expect(swivel.move(state)).toMatchObject(expected);
      });

      test('returns null if the point is in the deadzone', () => {
        expect(swivel.start(state)).toBeFalsy();
        state = {
          centroid: { 'x': 26, 'y': 39 },
        };
        expect(swivel.move(state)).toBeFalsy();
      });

      test('updates previous if the point is in the deadzone', () => {
        // This is to avoid sudden flips when exiting the deadzone
        expect(swivel.start(state)).toBeFalsy();
        const previous = swivel.previous;
        state = {
          centroid: { 'x': 26, 'y': 39 },
        };
        expect(swivel.move(state)).toBeFalsy();
        expect(swivel.previous).not.toEqual(previous);
      });

      test('Reports change in angle from previous', () => {
        expect(swivel.start(state)).toBeFalsy();
        const previous = swivel.previous;
        state = {
          centroid: {
            'x': state.centroid.x + 2,
            'y': state.centroid.y - 2,
          },
        };
        const expected = {
          'pivot': {
            'x': 25,
            'y': 40,
          },
          'rotation': -0.03082001817365554,
        };
        expect(swivel.move(state)).toMatchObject(expected);
        expect(swivel.previous).not.toEqual(previous);
      });
    });

    describe('end(state)', () => {
      test('returns null', () => {
        expect(swivel.end(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('returns null', () => {
        expect(swivel.cancel(state)).toBeFalsy();
      });
    });
  });

  describe('other prototype methods', () => {
  });
});

