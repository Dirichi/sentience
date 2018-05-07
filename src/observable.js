let Observable = {
  features() {
    return this.attributes.map(attr => this._evaluatedAttribute(attr));
  },

  _evaluatedAttribute(attr) {
    let value = this[attr]

    if (typeof(value) != 'number') {
      throw new Error('attribute should be numeric');
    }

    return value
  }
}

module.exports = Observable
