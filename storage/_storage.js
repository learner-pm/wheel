import { isJSON, isArray, isObject } from "../util/util.js"

const _storage = {
    set(key, value, expire = null) {
        if (expire < 0) {
            console.error(new Error("时间间隔不能为负。"))
            return
        }
        if (expire !== null) {
            localStorage.setItem(key, JSON.stringify({
                value: value,
                time: Date.now(),
                expire
            }))
        } else {
            if (isObject(value) || isArray(value)) {
                localStorage.setItem(key, JSON.stringify(value))
            } else {
                localStorage.setItem(key, value)
            }
        }
    },
    get(keyname) {
        const value = localStorage.getItem(keyname)
        if (isJSON(value)) {
            const vle = JSON.parse(value)
            if (vle.expire) {
                return Date.now() - vle.time > vle.expire ?
                    this.remove(keyname) : vle.value
            } else {
                return vle
            }
        } else {
            return value
        }
    },
    remove(keyname) { return localStorage.removeItem(keyname) === undefined },
    removeAll() { return localStorage.clear() === undefined },
    getKeyByIndex(index) {
        return localStorage.key(index)
    },
    getListKey() {
        const obj = []
        for (let i = 0; i < localStorage.length; i++) {
            obj.push({
                key: this.getKeyByIndex(i),
            })
        }
        return obj;
    },
    getListArray() {
        const obj = []
        for (let i = 0; i < localStorage.length; i++) {
            obj.push({
                key: this.getKeyByIndex(i),
                value: this.get(localStorage.key(i))
            })
        }
        return obj;
    },
    setList(option) {
        if (isArray(option)) {
            option.forEach(item => {
                if (isObject(item)) {
                    this.set(item.key, item.value)
                } else if (isArray(item)) {
                    this.set(item[0], item[1])
                } else {
                    console.error(new Error("请使用数组或对象结构!"))
                }
            })
        } else if (isObject(option)) {
            Object.entries(option).forEach((array) => {
                this.set(array[0], array[1])
            })
        } else {
            console.error(new Error("option类型应为数组或对象!"))
        }
    }
}
export default _storage