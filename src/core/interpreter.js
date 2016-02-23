/**
 *
 * @param element - The current target element
 * @param input - the input
 * @param Handler
 * @returns metadata about the gesture
 */
function interpreter(bindings, event) {
  console.log('Inside interpreter');
  console.log(bindings);
  return {
    type: 'tap',
    target: bindings[0].element,
    data: {
      bar: 'foo'
    }
  };
}

export default interpreter;
