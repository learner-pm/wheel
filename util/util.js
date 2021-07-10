function isObject(object) {
    return Object.prototype.toString.call(object) === "[object Object]"
}

function isString(string) {
    return typeof string === "string"
}

function isArray(array) {
    return Array.isArray(array)
}

function isJSON(string) {
    if (typeof string == 'string') {
        const obj = JSON.parse(string);
        if (typeof obj == 'object' && obj) {
            return true;
        } else {
            return false;
        }
    } else {
        console.error(new Error("传入参数类型错误"))
    }
}

export {
    isJSON,
    isString,
    isObject,
    isArray
}