/*
 * Tests Track class
 */

/* global expect, describe, test, jest, beforeAll, beforeEach */

'use strict';

const Track = require('src/Track.js');
const { Point2D, PHASES } = require('../core');

describe('Track', () => {
  describe('constructor', () => {
    test('Does not throw an exception', () => {
      expect(() => new Track()).not.toThrow();
    });

    test('Creates a Track object', () => {
      expect(new Track()).toBeInstanceOf(Track);
    });

    test('Created object has the type "track"', () => {
      expect(new Track().type).toBe('track');
    });

    test('Can be passed an element and a handler function', () => {
      const element = document.createElement('div');
      const handler = jest.fn();
      let track = null;
      expect(() => {
        track = new Track(element, handler);
      }).not.toThrow();
      expect(track.element).toBe(element);
      expect(track.handler).toBe(handler);
    });

    test('Can also be passed an options object with "phases"', () => {
      const element = document.createElement('div');
      const handler = jest.fn();
      const options = {
        phases: ['start'],
      };
      expect(() => new Track(element, handler, options)).not.toThrow();
    });
  });

  describe('phase hooks', () => {
    let element = null;
    let expected_data = null;
    let handler = null;
    let options = null;
    let state = null;

    beforeAll(() => {
      const points = [new Point2D(42, 117)];
      state = { activePoints: points };
      expected_data = { active: points };
      element = document.createElement('div');
    });

    beforeEach(() => {
      handler = jest.fn();
    });

    describe.each(PHASES)('%s(state)', (phase) => {
      test('Returns null if not included in "phases" option', () => {
        const track = new Track(element, handler);
        expect(track[phase](state)).toBeFalsy();
      });

      test('If specified in "phases", returns active points', () => {
        options = { phases: [phase] };
        const track = new Track(element, handler, options);
        expect(track[phase](state)).toMatchObject(expected_data);
      });
    });
  });
});
