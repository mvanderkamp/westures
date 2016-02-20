import Gesture from './Gesture.js';

class Tap extends Gesture {
  constructor() {
    super();
    this.type = 'tap';
  }

  didOccur(ev) {
  }
}

export default Tap;
