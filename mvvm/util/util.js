
function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

function isString(string) {
    return typeof string === "string"
}

function isArray(array) {
    return Array.isArray(array)
}

function getDom(dom) {
    return document.querySelector(dom)
}
export {
    isObject,
    isString,
    isArray,
    getDom
}