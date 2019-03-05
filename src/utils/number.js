
/**
 * 
 * @param {Number} num 
 * @desc 千分号 
 */
export function thousand(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}