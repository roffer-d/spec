new Vue({
	el:'#window',
	data:{
		baseList:[
			{id:'1',text:'颜色',selected:!1,
				children:[
					{id:'1_1',text:'红色',selected:!1},
					{id:'1_2',text:'黑色',selected:!1},
					{id:'1_3',text:'蓝色',selected:!1}
				]
			},
			{id:'2',text:'品牌',selected:!1,
				children:[
					{id:'2_1',text:'苹果',selected:!1},
					{id:'2_2',text:'黑莓',selected:!1},
					{id:'2_3',text:'华为',selected:!1},
					{id:'2_4',text:'三星',selected:!1}
				]
			},
			{id:'3',text:'国家',selected:!1,
				children:[
					{id:'3_1',text:'中国',selected:!1},
					{id:'3_2',text:'美国',selected:!1},
					{id:'3_3',text:'法国',selected:!1}
				]
			}
		],
		editData:[],//页面初始化编辑数据
		readyList:[],//待添加列表
		classList:[],//已添加到页面的数据
		selectedList:[],//选中的数据
		resultList:[]//最终显示到页面table的数据
	},
	beforeMount(){},
	mounted(){
		this.init();
	},
	watch:{
		/** 监听选中的数据集变化 **/
		selectedList:{
			handler(){
				let tempList = [];
				this.selectedList.forEach((item,index)=>{
					tempList.push(item.children);
				})

				/** 笛卡尔积算法求出多个数组的组合 **/
				function descartes() {
				    return Array.prototype.reduce.call(arguments,function(a, b) {
					    var ret = [];
					    a.forEach(function(a) {
					       b.forEach(function(b) {
					          ret.push(a.concat(b));
					       });
					    });
					   return ret;
				    }, [[]]);
				}

				/** 得出最终输出结果 **/
				let arr = descartes.apply(null,tempList);

				this.resultList = [];
				/** 遍历数据,追加附加属性 **/
				arr.forEach((item,index)=>{
					let option = {
						price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',goodImg:'',
						preImg:''
					};

					/** 初始化页面有编辑数据,把编辑数据赋值上去 ***/
					this.editData.forEach((data,idx)=>{
						if(item.id == data.id){
							option = Object.assign({},option,data);
						}
					})

					option.children = item;
					this.resultList.push(option);
				})

				this.$nextTick(function(){
					/** 生成表格之后,绑定表单验证事件 **/
					$("#specForm").validationEngine("attach");

					/** 合并连续相同数据的单元格 **/
					this.selectedList.forEach((item,index)=>{
						$("#dataTable").rowspan(index);//传入的参数是对应的列数从0开始，哪一列有相同的内容就输入对应的列数值
					})
				})
			},
			deep:true
		},
		editData:{
			handler(){
				let arr = [];//用作判断是否重复添加
				this.baseList.forEach((base,index)=>{
					base.children.forEach((child,idx)=>{
						this.editData.forEach(edit=>{
							edit.children.forEach(obj=>{
								if(child.id == obj.id){
									arr.indexOf(index)==-1 && this.getBaseInfo(index,1);//渲染已选择的父级规格
									this.select(index,idx);//选中已选择的子规格

									arr.push(index);
								}
							})
						})
					})
				})

				// this.classList = JSON.parse(JSON.stringify(this.readyList));
				// console.log(JSON.stringify(this.classList));
			},
			deep:true
		}
	},
	methods:{
		init(){
			/** 初始化页面,执行取消全部选中 **/
			// this.unSelectedAll();
			// this.initSelect();
			this.mergeCell();
			this.bindValidate();
		},
		/** 初始化编辑页面数据 **/
		initSelect(){
			this.editData = [
				{
				    "children": [
				        {
				            "id": "1_1",
				            "text": "红色",
				            "selected": true
				        },
				        {
				            "id": "2_2",
				            "text": "黑莓",
				            "selected": true
				        },
				        {
				            "id": "3_1",
				            "text": "中国",
				            "selected": true
				        }
				    ],
				    "price": "11",
				    "total": "12",
				    "cost": "13",
				    "partnerPrice": "14",
				    "shopCode": "15",
				    "shopBarcodes": "16",
				    "goodImg": "17",
				    "preImg": "http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg"
				},
				{
				    "children": [
				        {
				            "id": "1_1",
				            "text": "红色",
				            "selected": true
				        },
				        {
				            "id": "2_2",
				            "text": "黑莓",
				            "selected": true
				        },
				        {
				            "id": "3_2",
				            "text": "美国",
				            "selected": true
				        }
				    ],
				    "price": "",
				    "total": "",
				    "cost": "",
				    "partnerPrice": "",
				    "shopCode": "",
				    "shopBarcodes": "",
				    "goodImg": "",
				    "preImg": "http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg"
				},
				{
				    "children": [
				        {
				            "id": "1_1",
				            "text": "红色",
				            "selected": true
				        },
				        {
				            "id": "2_2",
				            "text": "黑莓",
				            "selected": true
				        },
				        {
				            "id": "3_3",
				            "text": "法国",
				            "selected": true
				        }
				    ],
				    "price": "",
				    "total": "",
				    "cost": "",
				    "partnerPrice": "",
				    "shopCode": "",
				    "shopBarcodes": "",
				    "goodImg": "",
				    "preImg": "http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg"
				},
				{
				    "children": [
				        {
				            "id": "1_3",
				            "text": "蓝色",
				            "selected": true
				        },
				        {
				            "id": "2_2",
				            "text": "黑莓",
				            "selected": true
				        },
				        {
				            "id": "3_3",
				            "text": "法国",
				            "selected": true
				        }
				    ],
				    "price": "",
				    "total": "",
				    "cost": "",
				    "partnerPrice": "",
				    "shopCode": "",
				    "shopBarcodes": "",
				    "goodImg": "",
				    "preImg": "http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg"
				}
			]
		},
		openModal(){
			let that = this;

			layer.open({
				type: 1 
		        ,title: '选择规格'
		        ,area: ['500px', '50%']
		        ,shade: 0
		        ,maxmin: true
		        ,offset: 'auto'
		        ,content: $('#baseList')
		        ,btnAlign:'c'
		        ,anim:1
		        ,shade:0.3
		        ,btn: ['确认', '取消'],
		        cancel: function(index, layero){ 
				  layer.close(index);
				  return false; 
				} 
		        ,btn1: function(index){
		            let tempList = JSON.parse(JSON.stringify(that.readyList));

		            let readyChildrenList = [],classChildrenList = [];
		            tempList.forEach(item=>{
		            	item.children.forEach(child=>{
		            		readyChildrenList.push(child);
		            	})
		            })
		            that.classList.forEach(item=>{
		            	item.children.forEach(child=>{
		            		classChildrenList.push(child);
		            	})
		            })
		            classChildrenList.forEach(item=>{
		            	readyChildrenList.forEach(ready=>{
		            		if(item.id==ready.id && item.selected){
		            			/** 循环匹配选中,防止之前规格的选中状态丢失 **/
		            			ready.selected = item.selected;
		            		}
		            	})
		            })

		            that.classList = tempList;
		            layer.close(index);
		        }
		        ,btn2:function(index){
		        	layer.close(index);
		        }
			})
		},
		/** 点击添加规格 type:该值存在表示编辑页面初始化数据 **/
		getBaseInfo(index,type){
			let base = this.baseList[index],selected = base.selected;

			base.selected = !base.selected;

			if(!selected){
				if(type){
					this.classList.push(base);
				}else{
					this.readyList.push(base);
				}
			}else{
				this.readyList.forEach((item,idx)=>{
					if(item.id==base.id){
						this.readyList.splice(idx,1);
					}
				})
			}
		},
		/** 点击规格事件 **/
		getInfo(pIndex,index){
			let current = this.classList[pIndex].children[index];//获取当前点击对象
			let selected = current.selected;//当前点击对象是否选中

			if(selected){
				this.unSelect(pIndex,index);
				return;
			}
			this.select(pIndex,index);
		},
		mergeCell(){
			jQuery.fn.rowspan = function(colIdx) { //封装的一个JQuery小插件 
				return this.each(function(){ 
					var that; 

					/** 合并之前先清除之前合并过的结果,如果不清除之前的结果会造成合并结果错乱 **/
					$('tr', this).find('td:eq('+colIdx+')').attr('rowSpan',1).show();

					$('tr', this).find('td:eq('+colIdx+')').filter(':visible').each(function(col) { 
						if (that!=null && $(this).html() == $(that).html()) { 
							rowspan = $(that).attr("rowSpan"); 
							if (rowspan == undefined) { 
								$(that).attr("rowSpan",1); 
								rowspan = $(that).attr("rowSpan"); 
							} 
							rowspan = Number(rowspan)+1; 
							$(that).attr("rowSpan",rowspan); 
							$(this).hide(); 
						} else { 
							that = this; 
						} 
					}); 
				}); 
			}
		},
		/**初始化表单验证**/
		bindValidate(){
			$('#specForm').validationEngine({
                promptPosition: 'bottomRight',
                validationEventTriggers:"keyup blur",
                scroll: false
            });
		},
		/** 提交事件 **/
		submit(){
			console.log(JSON.stringify(this.resultList));
			// let valid = $('#specForm').validationEngine("validate");
			// if(valid){
			// 	/** 表单验证通过 **/

			// }
		},
		/** 选中规格 **/
		select(pIndex,index){
			let before = this.classList;
			let after = this.selectedList;

			let parent = before[pIndex];//获取父及对象
			let current = parent.children[index];//获取当前点击对象
			current.selected = !0;//赋值当前对象选中

			/** 加这段代码是因为修改的是二维数组下的属性,无法更新视图,通过splice方法可以实现视图更新 **/
			before[pIndex].children.splice(index,1,current);

			/** 判断当前点击对象的父及是否已经在已选中数据集中出现 **/
			let has = after.some((item,index)=>{
				let flag = item.id == parent.id;

				if(flag){/** 如果父对象已经存在 **/

					/** 判断当前父对象有无子对象 **/
					let hasCurrent = item.children.some(child=>{
						return child.id == current.id
					})

					/** 没有子对象，添加子对象 **/
					!hasCurrent && item.children.push(Object.assign({},current));
				}

				return flag;
			})

			/** 如果父对象不存在，则表示第一次增加 **/
			if(!has){

				/** 先拷贝一份当前点击对象 **/
				let clone = JSON.parse(JSON.stringify(before[pIndex]));//深度拷贝对象

				/** 创建一个新对象 **/
				let newSelected = {
					id:clone.id,
					text:clone.text,
					children:[
						{
							id:current.id,
							text:current.text
						}
					]
				};

				/** 按照数据从上至下的顺序渲染表格 **/

				if(!after.length || after[0].id < parent.id){
					//如果选中的数组为空或者数组中第一个id比选中的父及id小,则排列在最后
					after.push(newSelected);
				}else{
					//在最前边加入
					after.unshift(newSelected);
				}
			}
		},
		/** 取消选中规格 **/
		unSelect(pIndex,index){
			let before = this.classList;
			let after = this.selectedList;

			let parent = before[pIndex];//获取父及对象
			let current = parent.children[index];//获取当前点击对象
			current.selected = !1;//赋值当前对象取消选中

			/** 加这段代码是因为修改的是二维数组下的属性,无法更新视图,通过splice方法可以实现视图更新 **/
			before[pIndex].children.splice(index,1,current);

			/** 取消选中，从选中数组中移除选中项 **/
			after.forEach((item,index)=>{
				if(item.id == parent.id){
					item.children.forEach((child,i)=>{
						if(child.id == current.id){
							item.children.splice(i,1);
						}
					})

					//如果删完了下边的属性,则删除父及
					!item.children.length && after.splice(index,1);

					return false;
				}
			})
		},
		/** 选中组 **/
		selectedGroup(classIndex){
			this.setState(4,classIndex);
		},
		/** 取消选中组 **/
		unSelectedGroup(classIndex){
			this.setState(5,classIndex);
		},
		/** 清空全选 **/
		unSelectedAll(){
			this.setState(3);
		},
		/** 全选 **/
		selectedAll(){
			this.setState(1);
		},
		/** 反选 **/
		selectReverse(){
			this.setState(2);
		},
		setState(type,classIndex){
			//type-->1：全选，2：反选，3：清空全选，4：选中组，5：清空组

			this.classList.forEach((item,index)=>{
				if(type == 4 || type == 5){

					if(classIndex == index){
						item.children.forEach((child,i)=>{
							switch(type){
								case 4:
									child.selected = !0;
									this.select(index,i);
									break;
								case 5:
									child.selected = !1;
									this.unSelect(index,i);
									break;
							}
							item.children.splice(i,1,child);
						})
					}

					return;
				}

				item.children.forEach((child,i)=>{
					switch(type){
						case 1:
							child.selected = !0;
							this.select(index,i);
							break;
						case 2:
							let isSelected = child.selected;
							child.selected = !isSelected;

							if(isSelected)this.unSelect(index,i);
							else this.select(index,i);
							break;
						case 3:
							child.selected = !1;
							this.unSelect(index,i);
							break;
					}
					item.children.splice(i,1,child);
				})
			})
		}
	}
})