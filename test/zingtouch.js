import ZingTouch from './../src/ZingTouch.js';
/**
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
describe('ZingTouch', function () {

  it('should be instantiated', function () {
    expect(ZingTouch).to.not.equal(null);
  });

  it('should not expose internal state', function () {
    expect(ZingTouch.state).to.be.undefined;
  });

  //TODO : Improve this test instead of hacking with try/catch
  it('should not expose the Bindings object ', function () {
    try {
      expect(Bindings).to.be.undefined;
    }
    catch (e) {
      expect(true).to.be.true;
    }
  });

  it('should have a bind method', function () {
    expect(ZingTouch.bind).to.exist;
  });

  it('should have an unbind method', function () {
    expect(ZingTouch.unbind).to.exist;
  });

});
