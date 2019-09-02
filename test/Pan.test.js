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

    beforeAll(() => {
      state = {
        centroid: new Point2D(42, 117),
      };
    });

    beforeEach(() => {
      pan = new Pan(element, handler);
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(pan.start(state)).toBeFalsy();
      });
    });

    describe('move(state)', () => {
    });

    describe('end(state)', () => {
      test('Returns null', () => {
        expect(pan.start(state)).toBeFalsy();
      });
    });

    describe('cancel(state)', () => {
      test('Returns null', () => {
        expect(pan.start(state)).toBeFalsy();
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

