'use strict';

const State   = require('./../../../src/core/State.js');
const Tap     = require('./../../../src/gestures/Tap.js');

describe('constructor()', () => {
  test('Requires no arguments', () => {
    expect(() => new State()).not.toThrow();
  });

  test('Instantiates the correct type of object', () => {
    expect(new State()).toBeInstanceOf(State);
  });
});

describe('prototype methods', () => {
  let state;
  beforeEach(() => {
    state = new State();
    [ 
      { phase: 'start', id: 0 },
      { phase: 'end', id: 1 },
      { phase: 'move', id: 2 },
      { phase: 'move', id: 3 },
      { will: 'be empty' },
      { phase: 'start', id: 5 },
      { phase: 'start', id: 6 },
    ].forEach( i => state.inputs.push(i) );
    delete state.inputs[4];
  });

  describe('addBinding(element, gesture, handler, capture, bindOnce)', () => {
    test('Adds a binding to a gesture instance', () => {
      state.addBinding(document.body, new Tap(), () => {}, false, false);
      expect(state.bindings.length).toBe(1);
    });
  });

  describe('getInputsInPhase(phase)', () => {
    describe('phase: start', () => {
      let starts;
      beforeAll(() => {
        starts = state.getInputsInPhase('start');
      });

      test('Retrieves the right number of inputs', () => {
        expect(starts.length).toBe(3);
      });

      test('All retrieved inputs are starts', () => {
        starts.forEach( s => {
          expect(s.phase).toBe('start');
        });
      });

      test('Ids and order persisted', () => {
        expect(starts[0].id).toBe(0);
        expect(starts[1].id).toBe(5);
        expect(starts[2].id).toBe(6);
      });
    });

    describe('phase: move', () => {
      let moves;
      beforeAll(() => {
        moves = state.getInputsInPhase('move');
      });

      test('Retrieves the right number of inputs', () => {
        expect(moves.length).toBe(2);
      });

      test('All retrieved inputs are moves', () => {
        moves.forEach( m => {
          expect(m.phase).toBe('move');
        });
      });

      test('Ids and order persisted', () => {
        expect(moves[0].id).toBe(2);
        expect(moves[1].id).toBe(3);
      });
    });

    describe('phase: end', () => {
      let ends;
      beforeAll(() => {
        ends = state.getInputsInPhase('end');
      });

      test('Retrieves the right number of inputs', () => {
        expect(ends.length).toBe(1);
      });

      test('All retrieved inputs are ends', () => {
        ends.forEach( m => {
          expect(m.phase).toBe('end');
        });
      });

      test('Ids and order persisted', () => {
        expect(ends[0].id).toBe(1);
      });
    });
  });

  describe('getInputsNotInPhase(phase)', () => {
    describe('phase: start', () => {
      let starts;
      beforeAll(() => {
        starts = state.getInputsNotInPhase('start');
      });

      test('Retrieves the right number of inputs', () => {
        expect(starts.length).toBe(3);
      });

      test('All retrieved inputs are not starts', () => {
        starts.forEach( s => {
          expect(s.phase).not.toBe('start');
        });
      });

      test('Ids and order persisted', () => {
        expect(starts[0].id).toBe(1);
        expect(starts[1].id).toBe(2);
        expect(starts[2].id).toBe(3);
      });
    });

    describe('phase: move', () => {
      let moves;
      beforeAll(() => {
        moves = state.getInputsNotInPhase('move');
      });

      test('Retrieves the right number of inputs', () => {
        expect(moves.length).toBe(4);
      });

      test('All retrieved inputs are not moves', () => {
        moves.forEach( m => {
          expect(m.phase).not.toBe('move');
        });
      });

      test('Ids and order persisted', () => {
        expect(moves[0].id).toBe(0);
        expect(moves[1].id).toBe(1);
        expect(moves[2].id).toBe(5);
        expect(moves[3].id).toBe(6);
      });
    });

    describe('phase: end', () => {
      let ends;
      beforeAll(() => {
        ends = state.getInputsNotInPhase('end');
      });

      test('Retrieves the right number of inputs', () => {
        expect(ends.length).toBe(5);
      });

      test('All retrieved inputs are not ends', () => {
        ends.forEach( m => {
          expect(m.phase).not.toBe('end');
        });
      });

      test('Ids and order persisted', () => {
        expect(ends[0].id).toBe(0);
        expect(ends[1].id).toBe(2);
        expect(ends[2].id).toBe(3);
        expect(ends[3].id).toBe(5);
        expect(ends[4].id).toBe(6);
      });
    });
  });
});

