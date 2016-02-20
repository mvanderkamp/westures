/**
 *
 * @param element - The current target element
 * @param input - the input
 * @param Handler
 * @returns metadata about the gesture
 */
function interpreter(element, input, Handler) {
  console.log('Inside interpreter');
  return {
    type: 'swipe',
    info: {
      bar: 'foo'
    },
    terminated: true
  };
}

export default interpreter;
