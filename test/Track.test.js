/*
 * Tests Track class
 */

/* global expect, describe, test, jest */

'use strict';

const Track = require('../src/Track.js');

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
});


