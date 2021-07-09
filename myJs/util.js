function isObject(object) {
    return Object.prototype.toString.call(object) === "[object Object]"
}

function isString(string) {
    return typeof string === "string"
}

function isArray(array) {
    return Array.isArray(array)
}

function isJSON(str) {
    if (typeof str == 'string') {
        const obj = JSON.parse(str);
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