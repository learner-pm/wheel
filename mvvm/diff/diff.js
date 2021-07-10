import { getDom } from "../util/util.js"
class _node {
    constructor() {
        this.el = el,
            this.name = undefined,
            this.type = undefined,
            this.attar = undefined
    }
    init(option) {
        this.el = getDom(option.dom)
    }
}

function Diff(dom) {
    this.dom = dom
    this.init()
    this.oldNode = {}
    this.newNode = {}
}
Diff.prototype = {
    _vnode() {

    },
    init() {
        this.oldNode = this.getNode(this.dom, {
            tag: this.dom.nodeName,
            attartes: Object.values(this.dom.attributes).map((e) => {
                return {
                    name: e.name,
                    value: e.value
                }
            }),
            value: null,
            children: []
        })
        console.log(this.oldNode)
        //this.replce()
    },
    replce() {
        const root = this.dom.parentNode
        console.log(root)
        if (!this.newNode) {
            console.log(this.generateDom())
            root.replaceChild(this.generateDom(), this.dom)

        }
    },
    generateDom() {
        const div = document.createElement(this.oldNode.tag)
        if (this.oldNode.attartes.length !== 0) {
            for (const att of this.oldNode.attartes) {
                console.log(name)
                //div.setAttribute(att.name,att.value)
                //div.textContent="1"
            }
        }

        return div

    },
    newDomArray() {
        this.newNode = this.getNode(this.dom, {
            tag: this.dom.nodeName,
            attartes: this.dom.attributes,
            value: null,
            children: []
        })
        //this.path()
        //console.log("old")
        //console.log(this.oldNode)
        console.log("new")
        console.log(this.newNode)
    },

    path() {
        const oldNodeArray = this.oldNode.children
        const newNodeArray = this.newNode.children
        for (let i = 0; i < oldNodeArray.length; i++) {
            const old = oldNodeArray[i] //比较节点
            const oldPar = old.tag.parentNode() //比较节点的父节点
            for (let j = 0; j < newNodeArray.length; j++) {
                const newD = newNodeArray[j]
                const newDPar = newD.tag.parentNode()
            }
        }
    },
    getNode(dom, domArray) {
        Array.from(dom.childNodes).forEach((e) => {
            const obj = {
                tag: e.nodeName,
                attartes: null,
                value: e.textContent.trim() || e.value || 'undefined',
                children: null
            }
            if (e.nodeType === 3) { //属性
                domArray.children.push(obj)
            } else if (e.nodeType === 1) { //元素
                if (Array.from(e.children).length === 0) {
                    const obj = {
                        tag: e.nodeName,
                        attartes: Object.values(e.attributes).map((att) => {
                            return {
                                name: att.name,
                                value: att.value
                            }
                        }),
                        value: e.textContent.trim() || e.value || 'undefined',
                        children: null
                    }
                    domArray.children.push(obj)
                } else {
                    const arry = {
                        tag: e.nodeName,
                        attartes: Object.values(e.attributes).map((att) => {
                            return {
                                name: att.name,
                                value: att.value
                            }
                        }),
                        value: e.textContent.trim() || e.value || 'undefined',
                        children: []
                    }
                    domArray.children.push(arry)
                    this.getNode(e, arry)
                }
            }
        })
        return domArray
    },

}
export default Diff