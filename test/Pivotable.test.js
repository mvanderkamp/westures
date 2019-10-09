/*
 * Tests Pivotable class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Pivotable = require('src/Pivotable.js');
const { Point2D } = require('westures-core');

let element = null;
let handler = null;

beforeAll(() => {
  element = document.createElement('div');
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
  });
});

