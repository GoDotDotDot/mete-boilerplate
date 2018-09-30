
module.exports.clearTerminal = function () {
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
      console.clear()
  }
}