import {util} from './../src/core/util.js';
import {Tap} from './../src/gestures/Tap.js';
/**
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
describe('util', function () {
  it('should be instantiated', function () {
    expect(util).to.not.equal(null);
  });
});

describe('util.getElement', function () {

  before(function () {
    document.body.innerHTML = '<div id="foobar"></div>';
  });

  it('should accept a string to be passed as a param for querySelector', function () {
    var element = util.getElement('#foobar');
    expect(element).to.not.equal(null);
    expect(element.tagName === 'div').to.not.equal(null);
  });

  it('should accept an element as a parameter', function () {
    var element = util.getElement(document.getElementById('foobar'));
    expect(element).to.not.equal(null);
    expect(element.tagName === 'div').to.not.equal(null);
  });

  it('should return null for an invalid string parameter', function () {
    var element = util.getElement('foobar');
    expect(element).to.equal(null);
  });

  it('should return null for an invalid parameter', function () {
    var element = util.getElement(9);
    expect(element).to.equal(null);
  });

  it('should return null for an invalid parameter', function () {
    var element = util.getElement(null);
    expect(element).to.equal(null);
  });

});

describe('util.isValidBinding', function () {
  it('should return true for a valid string key binding ', function () {
    expect(util.isValidBinding('tap')).to.be.true;
  });

  it('should return false for an invalid string key binding', function () {
    expect(util.isValidBinding('quadruple-tap')).to.be.false;
  });

  it('should return true for a valid gesture object', function () {
    var tapGesture = new Tap();
    expect(util.isValidBinding(tapGesture)).to.be.true;
  });

  it('should return false for an invalid object', function () {
    expect(util.isValidBinding({})).to.be.false;
  });
});
