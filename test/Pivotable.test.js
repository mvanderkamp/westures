/*
 * Tests Pivotable class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Pivotable = require('src/Pivotable.js');
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
});

beforeEach(() => {
  handler = jest.fn();
});

describe('Pivotable', () => {
  describe('constructor', () => {
    test('Returns a Pivotable object', () => {
      expect(new Pivotable()).toBeInstanceOf(Pivotable);
    });
  });

  describe('phase hooks', () => {
    let pivotable = null;
    let state = null;

    beforeEach(() => {
      const options = { applySmoothing: false };
      pivotable = new Pivotable('testing', element, handler, options);
      pivotable.updatePrevious = () => {};
      state = {
        active:   [],
        centroid: new Point2D(42, 117),
      };
    });

    describe('start(state)', () => {
      test('returns null', () => {
        expect(pivotable.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
      test('returns null', () => {
        expect(pivotable.move(state)).toBeFalsy();
      });
    });

    describe('end(state)', () => {
      test('returns null', () => {
        expect(pivotable.end(state)).toBeFalsy();
        state.active.push('hello');
        expect(pivotable.end(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('returns null', () => {
        expect(pivotable.cancel(state)).toBeFalsy();
      });
    });
  });

  describe('other prototype methods', () => {
    let pivotable = null;
    let state = null;

    beforeEach(() => {
      const options = { applySmoothing: false };
      pivotable = new Pivotable('testing', element, handler, options);
      pivotable.updatePrevious = () => {};
      state = {
        active:   [],
        centroid: new Point2D(42, 117),
      };
    });

    describe('updatePrevious(state)', () => {
      test('is a NOP in the Pivotable base class', () => {
        const previous = pivotable.previous;
        expect(pivotable.updatePrevious(state)).toBeFalsy();
        expect(pivotable.previous).toBe(previous);
      });
    });

    describe('restart(state)', () => {
      test('by default, sets the pivot to the center of the element', () => {
        expect(pivotable.restart(state)).toBeFalsy();
        expect(pivotable.pivot)
          .toMatchObject(Pivotable.getClientCenter(pivotable.element));
      });

      test('if using dynamicPivot, sets the pivot to the centroid', () => {
        const options = { applySmoothing: false, dynamicPivot: true };
        pivotable = new Pivotable('testing', element, handler, options);
        expect(pivotable.restart(state)).toBeFalsy();
        expect(pivotable.pivot).toBe(state.centroid);
      });
    });
  });
});

