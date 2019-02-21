# Changelog

## Releases

- [0.5.3](#0.5.3)
- [0.5.2](#0.5.2)
- [0.5.0](#0.5.0)

## 0.5.3

- Fix buggy Swivel results caused by >1 active inputs.
- Fix bugs in Swipe:
    - Erroneous acceptance of >1 inputs.
    - Velocity going to infinity in some cases (division by 0)
    - Direction calculation could produce errors, switched to using a more
      common mathematical approach.
- Normalize Swipe a bit by taking average velocity instead of max. 

## 0.5.2

- Fix bug in Swivel when using the `pivotCenter` option. Initial angle wasn't
  being set correctly, causing jumps when initiating a Swivel.

## 0.5.0

- Rename Region#bind() -> Region#addGesture() and Region#unbind() ->
  Region#removeGestures().
    - I was not happy with the way that the 'bind' naming clashes with the
      'bind' function on the Function prototype.
- Simplified "unbind" function. It now returns null, as the Bindings should not
  be exposed to the end user.
- Sped up Binding selection in the Region's `arbitrate` function, while
  simultaneously fixing a critical bug!
    - Only the bindings associated with elements on the composed path of the
      first input to touch the surface will be accessed.
    - In other words, this batch of bindings is cached instead of being
      recalculated on every input event.
    - Previously, if the user started one input in one bound element, then
      another input in another bound element, the bindings for both elements
      would think they have full control, leading to some potentially weird
      behaviour.
    - If you want this behaviour, you'll now have to simulate it by creating a
      separate region for each binding.
- Removed Region#getBindingsByInitialPos
- Removed State#someInputWasInitiallyInside
- Improved test coverage a bit

