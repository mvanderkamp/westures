/*
 * Tests Press class
 */

/* global expect, describe, test, jest, beforeEach, beforeAll */

'use strict';

const Press = require('src/Press.js');
const { Point2D, Input } = require('core');
const MouseEvent = require('core/test/MouseEvent.js');

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

describe('Press', () => {
  describe('constructor', () => {
    test('Returns a Press object', () => {
      expect(new Press()).toBeInstanceOf(Press);
    });
  });

  describe('phase hooks', () => {
    let press = null;
    let state = null;
    let event = null;
    let input = null;
    const options = { applySmoothing: false };

    beforeEach(() => {
      event = new MouseEvent(0, element, MouseEvent.start, 42, 117);
      input = new Input(event, event.id);
      state = {
        centroid: new Point2D(42, 117),
        active:   [input],
      };
      setTimeout.mockClear();
      press = new Press(element, handler, options);
    });

    describe.each(['move', 'end', 'cancel'])('%s(state)', (phase) => {
      test('Returns null', () => {
        expect(press[phase](state)).toBeFalsy();
      });

      test('Timers are not set', () => {
        press[phase](state);
        expect(setTimeout).not.toHaveBeenCalled();
      });

      test('Handler is not called', () => {
        press[phase](state);
        expect(press.handler).not.toHaveBeenCalled();
      });
    });

    describe('start(state)', () => {
      test('Returns null', () => {
        expect(press.start(state)).toBeFalsy();
      });

      test('Timer is set', () => {
        press.start(state);
        expect(setTimeout).toHaveBeenCalled();
      });

      test('Handler is called if delay is reached', () => {
        press.start(state);
        jest.runAllTimers();
        expect(press.handler).toHaveBeenCalled();
      });

      test('Handler is still called if additional pointers added', () => {
        press.start(state);
        state.active.push(new Input(new MouseEvent(
          0, element, MouseEvent.start,
          107, 222,
        )));
        jest.runAllTimers();
        expect(press.handler).toHaveBeenCalled();
      });

      test('Handler is not called if pointer removed before timeout', () => {
        press.start(state);
        state.active = [];
        jest.runAllTimers();
        expect(press.handler).not.toHaveBeenCalled();
      });

      test('Handler is not called if pointer moves beyond threshold', () => {
        press.start(state);
        input.update(new MouseEvent(0, element, MouseEvent.move, -123, -524));
        jest.runAllTimers();
        expect(press.handler).not.toHaveBeenCalled();
      });

      test('Handler is not called if pointer replaced with new pointer', () => {
        // Event though it's in exactly the same spot...
        press.start(state);
        state.active = [new Input(event, event.id)];
        jest.runAllTimers();
        expect(press.handler).not.toHaveBeenCalled();
      });
    });
  });
});

