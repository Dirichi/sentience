let math = require('mathjs')

module.exports.random2DMatrix = function(ndimX, ndimY) {
  let totalElements  = ndimX * ndimY
  let array = Array.from({length: totalElements}, () => Math.random())
  array = math.reshape(array, [ndimX, ndimY])
  return math.matrix(array)
}

module.exports.uniqueValues = function (array) {
  return [...new Set(array)]
}

module.exports.range = function (maximum) {
  return [...Array(maximum).keys()]
}

module.exports.randomInRange = function (maximum) {
  return Math.floor(Math.random() * maximum)
}

module.exports.randomChoiceFrom = function(array) {
  let randomIndex = module.exports.randomInRange(array.length)
  return array[randomIndex]
}
