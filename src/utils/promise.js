export function catchPromise(fn) {
  return new Promise((resolve, rejct) => {
    fn.then(res => resolve(res)).catch(e => resolve(false,e))
  })
}
