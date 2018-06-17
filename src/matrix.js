class Matrix {
  constructor(array) {
    this._values = array
  }

  static random(numRows, numColumns) {
    let array = []

    for (let i = 0;  i < numRows; i++) {
      let row = []
      for (let j = 0; j < numColumns; j++) {
        row.push(Math.random())
      }
      array.push(row)
    }

    return new this(array)
  }

  static product(matrixA, matrixB) {
    this._checkProductCompatibility(matrixA, matrixB)

    let rows = matrixA.rows()
    let columns = matrixB.columns()

    let productValues = rows.map(function (row) {
      return columns.map((column) => Matrix.dot(row, column))
    })

    return new this(productValues)
  }

  static _checkProductCompatibility(matrixA, matrixB) {
    if (matrixA.numColumns != matrixB.numRows) {
      throw new Error(`incompatible dimensions for multiplication (${matrixA.size()}, ${matrixB.size()})`)
    }
  }

  static scalarProduct(matrix, scalar) {
    let values = matrix.rows().map((row) => row.map((value) => value * scalar))
    return new this(values)
  }


  static dot(vectorA, vectorB) {
    let Avalues = vectorA.valueOf()
    let Bvalues = vectorB.valueOf()
    let products = Avalues.map((_, index) => Avalues[index] * Bvalues[index])
    let sum = products.reduce((acc, values) => acc + values, 0)

    return sum
  }

  rows() {
    return this._values
  }

  columns() {
    let rows = this.rows()
    let transpose = rows[0].map((_,c) => rows.map(row => row[c]))

    return transpose
  }


  get numRows() {
    return this._values.length
  }

  get numColumns() {
    return this._values[0].length
  }

  set(row, column, value) {

  }

  setColumn(columnIndex, value) {
    this._checkAllowedColumnIndex(columnIndex)
    this._checkCompatibleColumn(value)

    for (let i = 0; i < this._values.length; i++) {
      let row = this._values[i]
      row[columnIndex] = value[i]
    }
  }

  _checkAllowedColumnIndex(columnIndex) {
    if (columnIndex >= this.numColumns) {
      throw new Error(`provided column index outside column index range (index: ${columnIndex}, numColumns: ${this.numColumns})`)
    }
  }

  _checkCompatibleColumn(columnArray) {
    if (columnArray.length != this.numRows) {
      throw new Error(`incompatible dimensions for column (replacement length: ${columnArray.length}, numRows: ${this.numRows})`)
    }
  }

  get(row, column) {

  }

  size() {
    return [this.numRows, this.numColumns]
  }

  valueOf() {
    return this._values
  }
}

module.exports = Matrix
