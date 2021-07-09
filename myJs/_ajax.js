import { isJSON, isString, isObject } from "./util.js"

const httpConfig = () => {
    return {
        url: undefined,
        method: undefined,
        data: undefined,
        headers: undefined
    }
}
const returnObj = (config, data, status, statusText) => {
    return {
        config,
        data,
        status,
        statusText,
    }
}

const urlChange = (data) => {
    const arrayObject = Object.entries(data)
    return "?" + arrayObject.reduce((total, currentValue, index) => {
        return total + currentValue[0] + "=" + currentValue[1] + (index === arrayObject.length - 1 ? '' : '&')
    }, '')
}

const chick = (option, type = 1) => {
    const { url, data, headers } = option
    if (!isString(url)) {
        console.error(new Error("Url参数错误"))
        return
    }
    if (!isObject(data)) {
        console.error(new Error("Data参数错误"))
        return
    }
    const _httpConfig = httpConfig()
    _httpConfig.url = type === 1 ? url : (url + urlChange(data))
    _httpConfig.data = data
    _httpConfig.headers = headers || {
        'content-type': "application/json"
    }
    _httpConfig.method = type === 1 ? "POST" : "GET"
    return _http(type, _httpConfig)
}
const _http = (type, config) => {
    return new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.open(config.method, config.url, true)
        Object.entries(config.headers).forEach(array => {
            xmlhttp.setRequestHeader(array[0], array[1])
        })
        type === 1 ? xmlhttp.send(JSON.stringify(config.data)) : xmlhttp.send()
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                resolve(
                    returnObj(
                        config,
                        isJSON(xmlhttp.responseText) ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText,
                        xmlhttp.status,
                        xmlhttp.statusText,
                    )
                )
            } else if (xmlhttp.status === 404) {
                reject(
                    returnObj(
                        config,
                        404,
                        xmlhttp.status,
                        xmlhttp.statusText
                    )
                )
            }
        }
    })
}
const _ajax = {
    get(url, data = {}, headers) {
        return chick({
            url, data, headers
        }, 0)

    },
    post(url, data = {}, headers) {
        return chick({
            url, data, headers
        }, 1)
    }
}
export default _ajax