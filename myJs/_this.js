Array.prototype.myMap = function (callback) {
    const newArr = []
    const self = this
    this.reduce((tolte, num, index) => {
        let re = callback(num, index, self)
        newArr.push(re)
    }, 0)
    return newArr
}
let arr = [1, 2, 3]
let getre = arr.myMap((e, index, arr) => {
    console.log(index)
    return e * 2
})
console.log(getre)