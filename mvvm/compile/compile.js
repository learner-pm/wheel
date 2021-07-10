/*
	observe 观察 val对象得数据 和绑定到this得数据，变化通知dep
	dep 获取变化 通知编译中绑定函数（无参）
	compile 初始化编译，改变页面变化。并且为存在{{}}得地方绑定函数
	this.a改变 ->this.$val.a改变 ->视图改变
	视图改变->this.a->this.$val.a
	@click v-mode 属性改变。v-for
				
*/
/*
	编译,添加订阅者
*/
import Diff from '../diff/diff.js'

function Compile(el, val, assembly, dep, diff) {
	this.$dom = document.getElementById(el) //dom结构
	this.$val = val //变量对象
	this.$assembly = assembly //组件
	this.dep = dep
	this.init()
	//assembly._diff = new Diff(this.$dom)
}
Compile.prototype = {
	init: function () {
		try {
			new Observe(this.$val, this.$assembly, this.dep, this.diff) //观察变量
			//this.$assembly_diff.init()
			this.recursionDom(this.$dom)
			return true
		} catch (e) {
			return e
		}
	},
	recursionDom(dom) {
		Array.from(dom.childNodes).forEach((element, index) => {
			if (element.nodeType === 3) { //文本
				this.translateInterpolation(element)
			} else if (element.nodeType === 1) { //元素
				this.domChange(element)
				if (Array.from(element.children).length === 0) { //没有子元素 //进行属性绑定
					this.translateInterpolation(element)
				} else {
					this.recursionDom(element)
				}
			}
		})
	},
	domChange(elemt) {
		Object.values(elemt.attributes).forEach((valueAt) => {
			if (valueAt.name.indexOf('v-model') !== -1) { //input 数据实现
				this.translateModel(valueAt, elemt)
			}
			if (valueAt.name.indexOf('@') === 0) { //方法挂载
				this.translateFunction(valueAt, elemt)
			}
		})
	},
	translateModel(valueAt, elemt) {
		try {
			if (elemt.tagName === 'INPUT') {
				let self = this.$assembly
				elemt.value = self[valueAt.value]
				elemt.defaultValue = self[valueAt.value]
				elemt.onkeyup = function () {
					//console.log(elemt.value)
					let newval = elemt.value
					self[valueAt.value] = newval
				}

			} else {
				console.error(new Error("该属性只能使用在input元素上，this attributy just used by input"))
			}
		} catch (e) {
			console.error(e)
		}
		elemt.attributes.removeNamedItem(valueAt.name)
	},
	translateFunction(valueAt, elemt) {
		let self = this.$assembly //组件对象
		let ve = valueAt.value //方法名字
		let dom = valueAt.name.replace("@", "") //绑定方法类型
		let asg = []
		let ifHave = false
		try {
			if (ve.search(/\(/) != -1) { //有()
				const data = ve.split(/\(|\)/)[1].split(',')
				for (let dataKey of data) {
					const dataAsg = dataKey.replace(/\'/g, "")
					for (let [key, value] of Object.entries(this.$val)) {
						if (key == dataAsg) {
							asg.push(value)
							ifHave = true
							break
						}
					} !ifHave ? asg.push(dataAsg) : ''
				}
			} else { //参数空
				asg = []
			}
		} catch (e) {
			console.error(e)
			//TODO handle the exception
		}
		for (let [key, value] of Object.entries(self.$methos)) {
			if (ve.split(/\(|\)/)[0] === key) {
				elemt.addEventListener(dom, value.bind(self, ...asg))
			} else if (ve !== key || ve === null) {
				//console.log(ve)
			}
		}
		elemt.attributes.removeNamedItem(valueAt.name)
	},
	translateInterpolation(dom) {
		let textInter = dom.textContent
		const reg = /\{\{((?:.|\n)+?)\}\}/ //判断存在性
		const regA = /\{\{((?:.|\n)+?)\}\}/g //匹配多个
		if (reg.test(textInter)) {
			textInter.match(regA).forEach((value) => {
				//获取每个文本有多少个要匹配的值，平且遍历
				const valArray = Object.entries(this.$val)
				const vle = value.replace(/{{/, '').replace(/}}/, '')
				for (let i = 0; i < valArray.length; i++) {
					if (vle === valArray[i][0]) {
						textInter = textInter.replace(reg, valArray[i][1])
						this.dep.push(dom, vle)
						break
					} else if (vle !== valArray[i][0] && i === valArray.length - 1) {
						textInter = textInter.replace(reg, '')
						console.error(new Error(
							`[Mvvm]变量${vle}没有定义,请定义后使用 `
						))
					}
				}
			})
			dom.textContent = textInter.trim()
		}
	}
}

/*
	协调者
*/
function Dep(assembly) { //存储 通知数据改变   承接
	this.id = 0 //次数
	this.valArray = [] //储存组件得变量
	this.assembly = assembly
}
Dep.prototype = {
	push(wac, attr) {
		this.id++
		this.valArray.push({
			attr: attr, //属性名
			dom: wac //dom 节点
		})
	},
	noify(aAttr) {
		const self = this.assembly
		let changeDom = []
		for (let i = 0; i < this.valArray.length; i++) {
			if (aAttr === this.valArray[i].attr) {
				changeDom.push(this.valArray[i].dom)
			}
		}
		Object.keys(self.$val).forEach((key) => {
			if (key === aAttr) {
				if (self.$val[key] !== self[key]) {
					changeDom.forEach((e) => {
						e.textContent = self[key]
					})
					console.log(aAttr + "得值改变了,触发函数修改视图")
				}
			}
		})
		self.$val[aAttr] = self[aAttr] //让val里面的值改变
	},
}
/*
	遍历变量，发布者
*/
function Observe(val, assembly, dep, diff) {
	this.$val = val //组件得变量
	this.$assembly = assembly //组件对象
	this.dep = dep
	this.diff = diff
	this.init()
	this.definePropertyData(assembly, val)

	this.dep = new Dep()
}
Observe.prototype = {
	init() {
		let dp = new Dep()
		this.valObserve(dp)
	},
	definePropertyData(self, val) {
		Array.from(Object.keys(val)).forEach((value, index) => {
			this.definePropertyObject(self, value)
		})
		//console.log(this)
	},
	definePropertyObject(self, data) {
		let value = self[data]
		Object.defineProperty(self, data, {
			enumerable: true,
			configurable: true,
			get: function () {
				return value
			},
			set: function (newValue) { //this 指向转入得组件即 self
				value = newValue
				this._watcher.noify(data) //发布
				//console.log(this)
				//this._diff.newDomArray() //通知改变。
			}
		})
	},
	valObserve(dp) {
		Object.keys(this.$val).forEach((e) => {
			dp.id++
			dp.valArray.push(e)
			this.observe(e)
		})
	},
	observe(e) {
		let val = this.$val[e]
		Object.defineProperty(this.$assembly, e, { //绑定
			enumerable: true,
			configurable: true,
			get: function () {
				return val
			},
			set: function (newVal) {
				val = newVal
				//this.$val[e]=newVal
				this._compile.init() //这里得this指向组件,调用方法通知视图改变
			}
		})
	},
}

export {
	Compile,
	Observe,
	Dep
}