/*
		方法实现
	*/
	function Direct(el,mvvm){//模板翻译对象
		this.init(el,mvvm)
	}
Direct.prototype={
		init(el,mvvm){
			this.$el=el//who
			this.$node=document.getElementById(el)//节点
			this.$self=mvvm//mvvm对象实例
			try{
				//this.compileDri()//实现功能绑定
				return true
			}catch(e){
				return e
				//TODO handle the exception
			}
		},
		compileDri(){//解析属性
			Array.from(this.$node.childNodes).forEach((elemt)=>{
				if(elemt.nodeType===1){//是元素
				/*	v - 指令
					@ - 方法 
					elemt.attributes -元素属性组
				*/
					Object.values(elemt.attributes).forEach((valueAt)=>{
						if(valueAt.name.indexOf('v-model')!==-1){//input 数据实现
							try{
								if(elemt.tagName==='INPUT'){
								let self=this.$self
								elemt.value=self[valueAt.value]
								elemt.oninput=function(){
									//console.log(elemt.value)
									let newval=elemt.value
									
									self[valueAt.value]=newval
								}
								
								}else{
									console.error(new Error("该属性只能使用在input元素上，this attributy just used by input"))
								}
							}catch(e){
								console.error(e)
							}
							elemt.attributes.removeNamedItem(valueAt.name)
						}
						if(valueAt.name.indexOf('@')===0){//方法挂载
							let self=this.$self//组件对象
							let ve=valueAt.value//方法名字
							let dom=valueAt.name.replace("@","")//绑定方法类型
							let asg=[]
							let ifHave=false
							try{
								if(ve.search(/\(/)!=-1){//是否有()
									const data = ve.split(/\(|\)/)[1].split(',')
									for(let dataKey of data){
										const dataAsg = dataKey.replace(/\'/g,"")
										for (let [key,value] of Object.entries(self.$val) ) {
											if(key==dataAsg){
												asg.push(value)
												ifHave=true
												break
											}
										}
										!ifHave?asg.push(dataAsg):''
									}
								}else{//参数空
									asg=[]
								}
							}catch(e){
								 console.error(e)
								//TODO handle the exception
							}
							for (let [key,value] of Object.entries(self.$methos)){
								if(ve.split(/\(|\)/)[0]===key){
									elemt.addEventListener(dom,value.bind(self,...asg))
								}
								else if(ve!==key||ve===null){
										//console.log(ve)
								}	
							}
							elemt.attributes.removeNamedItem(valueAt.name)
						}//console.log(valueAt)console.log( typeof String(valueAt))
					})//console.log(value.attributes)
				}
				if(elemt.nodeType==3){
					//console.log(elemt)
				}
				//console.log(elemt)
			})
			
		}
	}
	