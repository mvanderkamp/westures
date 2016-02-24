import Gesture from './Gesture.js';

class Tap extends Gesture {
  constructor(maxDelay, numInputs) {
    super();
    this.type = 'tap';
    this.maxDelay = (maxDelay) ? maxDelay : 300;
    this.numInputs = (numInputs) ? numInputs : 1;
  }

  start(inputs) {

    if (inputs.length === this.numInputs) {
      var progress = inputs[0].getGestureProgress(this.type);
      progress.start = new Date().getTime();
    }

    return null;
  }

  move(inputs) {
    inputs[0].resetProgress(this.type);
    return null;
  }

  end(inputs) {
    if (inputs.length > this.numInputs) {
      return null;
    }

    var progress = inputs[0].getGestureProgress(this.type);
    if (Object.keys(progress).length !== 0) {
      var interval = new Date().getTime() - progress.start;
      if (this.maxDelay >= interval) {
        return {
          interval: interval
        };
      } else {
        inputs[0].resetProgress(this.type);
      }
    }

    return null;

  }

}

export default Tap;
