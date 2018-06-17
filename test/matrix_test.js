let Matrix = require('../src/matrix.js')
let assert = require('assert')
let sinon = require('sinon')

describe('Matrix', function() {
  describe('.random', function () {
    it('returns a random matrix with m by n dimensions', function () {
      let matrix = Matrix.random(3, 5)

      assert.ok(matrix.valueOf() instanceof Array)
      assert.deepEqual(matrix.size(), [3, 5])
    })
  })

  describe('.product', function () {
    it('raises an error if the matrix dimensions are incompatible', function () {
      let matrixA = new Matrix([[1, 2], [3, 1]]) // 2 X 2
      let matrixB = new Matrix([[1, 2], [3, 1], [4, 6]]) // 3 X 2

      assert.throws(Matrix.product.bind(Matrix, matrixA, matrixB), Error, `incompatible dimensions for multiplication (${matrixA.size()}, ${matrixB.size()})`)
    })

    it('returns the product of the two matrices', function () {
      let matrixA = new Matrix([[1, 2], [3, 1]]) // 2 X 2
      let matrixB = new Matrix([[4, 6, 5], [3, 1, 7]]) // 2 X 3

      //[1, 2]  *  [4, 6, 5]  => [10, 8, 19]
      //[3, 1]     [3, 1, 7]     [15, 19, 22]

      let product = Matrix.product(matrixA, matrixB)
      let expectedResult = [[10, 8, 19], [15, 19, 22]]
      assert.deepEqual(product.valueOf(), expectedResult)
    })
  })


  describe('.scalarProduct', function () {
    it('returns the product of a matrix and a scalar', function () {
      let matrix = new Matrix([[1, 2], [3, 1]])

      //[1, 2]  *  [4, 6, 5]  => [10, 8, 19]
      //[3, 1]     [3, 1, 7]     [15, 19, 22]

      let product = Matrix.scalarProduct(matrix, 5)
      let expectedResult = [[5, 10], [15, 5]]
      assert.deepEqual(product.valueOf(), expectedResult)
    })
  })

  describe('.dot', function () {
    it('raises an error if the matrix dimensions are incompatible', function () {
      let matrixA = new Matrix([[1, 2], [3, 1]]) // 2 X 2
      let matrixB = new Matrix([[1, 2], [3, 1], [4, 6]]) // 3 X 2
    })

    it('returns the dotProduct of two row vectors', function () {
      let vectorA = new Matrix([1, 3])
      let vectorB = new Matrix([4, 6])

      let product = Matrix.dot(vectorA, vectorB)
      assert.equal(product, 22)
    })

    it('returns the dotProduct of row and column vectors', function () {
      let vectorA = new Matrix([1, 3])
      let vectorB = new Matrix([[4], [6]])

      let product = Matrix.dot(vectorA, vectorB)
      assert.equal(product, 22)
    })

    it('returns the dotProduct of colum and row vectors', function () {
      let vectorA = new Matrix([[1], [3]])
      let vectorB = new Matrix([4, 6])

      let product = Matrix.dot(vectorA, vectorB)
      assert.equal(product, 22)
    })

    it('returns the dotProduct of two column vectors', function () {
      let vectorA = new Matrix([[1], [3]])
      let vectorB = new Matrix([[4], [6]])

      let product = Matrix.dot(vectorA, vectorB)
      assert.equal(product, 22)
    })
  })

  describe('rows', function () {
    it('returns the values of the array', function () {
      let matrix = new Matrix([[1, 2], [3, 1]])

      assert.deepEqual(matrix.rows(), [[1, 2], [3, 1]])
    })
  })

  describe('columns', function () {
    it('returns the columns of the array', function () {
      let matrix = new Matrix([[4, 6, 5], [3, 1, 7]])

      assert.deepEqual(matrix.columns(), [[4, 3], [6, 1], [5, 7]])
    })
  })

  describe('setColumn', function () {
    it('throws an error if the dimension of the replacement column is incompatible', function () {
      let matrix = new Matrix([[4, 6, 5], [3, 1, 7]])

      assert.throws(matrix.setColumn.bind(matrix, 1, [7]), Error, `incompatible dimensions for column (replacement length: 1, numRows: 2)`)
    })

    it('throws an error if the provided column index is beyond the maximum column index', function () {
      let matrix = new Matrix([[4, 6, 5], [3, 1, 7]])

      assert.throws(matrix.setColumn.bind(matrix, 3, [7, 5]), Error, `provided column index outside column index range (index: 3, numColumns: 3)`)
    })

    it('returns the columns of the array', function () {
      let matrix = new Matrix([[4, 6, 5], [3, 1, 7]])
      matrix.setColumn(1, [7, 9])

      assert.deepEqual(matrix.valueOf(), [[4, 7, 5], [3, 9, 7]])
    })
  })
})
