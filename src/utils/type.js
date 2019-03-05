/**
 *
 * @param {Object} data
 * @param {String} type // String
 */
export function judgeType(data, type) {
  return Object.prototype.toString.apply(data) === `[object ${type}]`;
}