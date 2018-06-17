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
