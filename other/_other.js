Array.prototype.myMap = function (callback) {
    const newArr = []
    const self = this
    this.reduce((tolte, num, index) => {
        let re = callback(num, index, self)
        newArr.push(re)
    }, 0)
    return newArr
}
Function.prototype.mycall = function (obj, ...arg) {
    const fn = Symbol('临时')
    obj[fn] = this
    obj[fn](...arg)
    delete obj[fn]
}

