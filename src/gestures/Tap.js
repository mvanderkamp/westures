import Gesture from './Gesture.js';

class Tap extends Gesture {
  constructor() {
    super();
    this.type = 'tap';
    this.maxDelay = 300;
    this.fingers = 1;
  }

  start(inputs) {

    if (inputs.length > 1) {
      return null;
    }

    if (!inputs[0].progress[this.type]) {
      inputs[0].progress[this.type] = {};
    }

    //Record the timestamp
    inputs[0].progress[this.type].start = new Date().getTime();
    return null;
  }

  move(inputs) {
    return null;
  }

  end(inputs) {
    if (inputs.length > 1) {
      return null;
    }

    var progress = inputs[0].progress[this.type];
    var interval = new Date().getTime() - progress.start;
    if (this.maxDelay >= interval) {
      return {
        interval: interval
      };
    }

  }

}

export default Tap;
