class Tiler {
  constructor(args) {
    this.minX = args.minX
    this.minY = args.minY
    this.maxX = args.maxX
    this.maxY = args.maxY
    this.xTiles = args.xTiles
    this.yTiles = args.yTiles
    this.tileRadius = args.tileRadius
  }

  tileVector(x, y) {
    let tileVec = []

    for (var i = 0; i < this.xTiles; i++) {
      for (var j = 0; j < this.yTiles; j++) {
        let circleX = i * (this.maxX - this.minX) / this.xTiles
        let circleY = j * (this.maxY - this.minY) / this.yTiles
        if (this._distance(circleX, circleY, x, y) <= this.tileRadius) {
          tileVec.push(1)
        }
        else {
          tileVec.push(0)
        }
      }
    }

    return tileVec
  }

  _distance(x, y, x1, y1) {
    let squaredDistance = ((x - x1) ** 2) + ((y - y1) ** 2)
    return Math.sqrt(squaredDistance)
  }
}

module.exports = Tiler
