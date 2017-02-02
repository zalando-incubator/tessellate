// @flow

export function memoize<A, B>(fn: (a?: A) => B): (a?: A) => B {
  let result
  return (a?: A) => {
    if (result === undefined) result = fn(a)
    return result
  }
}
