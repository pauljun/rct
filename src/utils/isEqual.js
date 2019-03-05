import equal from 'fast-deep-equal';

export function isEqual(objValue, othValue) {
  return equal(objValue, othValue);
}
