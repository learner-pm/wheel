/*
    模板翻译
    el 组件dom对象
    val 组件变量
    methso 组件方法
    { compArry,compileText }
*/
import { isObject } from "../util/util.js"
import { Compile, Dep } from './compile/compile.js'

function Mvvm(obj) { //主对象
    if (new.target !== Mvvm)
        throw new Error('必须使用 new 命令生成实例');
    else {
        if (isObject(obj)) {
            this.$el = obj.el
            this.$val = obj.data
            this.$methos = obj.mthoeds
            this.init() //初始化
        } else {
            console.error(new Error("not use{"))
        }
    }

}

Mvvm.prototype = {
    mount() {
        console.log("s");
    },
    init: function () {
        console.log("开始编译")
        try {
            this._watcher = new Dep(this)
            this._compile = new Compile(this.$el, this.$val, this, this._watcher, this._diff) //转换并绑定
        } catch (e) {
            console.error(e)
            //TODO handle the exception
        }
    }
}

export default Mvvm

/*
指令解析
方法挂载
双向绑定

观察者模式实现
*/