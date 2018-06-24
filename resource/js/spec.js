new Vue({
	el:'#window',
	data:{
		baseList:[
			{id:'1',text:'颜色',selected:!1,
				children:[
					{id:'1_1',text:'红色',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'1_2',text:'黑色',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'1_3',text:'蓝色',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''}
				]
			},
			{id:'2',text:'品牌',selected:!1,
				children:[
					{id:'2_1',text:'苹果',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'2_2',text:'黑莓',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'2_3',text:'华为',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'2_4',text:'三星',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''}
				]
			},
			{id:'3',text:'国家',selected:!1,
				children:[
					{id:'3_1',text:'中国',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'3_2',text:'美国',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''},
					{id:'3_3',text:'法国',price:'',total:'',cost:'',partnerPrice:'',shopCode:'',shopBarcodes:'',selected:!1,
						preImg:'http://zhekw.oss-cn-beijing.aliyuncs.com/img/338b686a1ecb4658b058cf943cc07700.jpg',goodImg:''}
				]
			}
		],
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
				this.resultList = descartes.apply(null,tempList);

				this.$nextTick(function(){
					/** 合并连续相同数据的单元格 **/
					this.selectedList.forEach((item,index)=>{
						$("#dataTable").rowspan(index);//传入的参数是对应的列数从0开始，哪一列有相同的内容就输入对应的列数值
					})
				})
			},
			deep:true
		}
	},
	methods:{
		init(){
			/** 初始化页面,执行取消全部选中 **/
			this.unSelectedAll();
			this.bindJQ();
		},
		openModal(type){
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
		            that.classList = JSON.parse(JSON.stringify(that.readyList));
		            layer.close(index);
		        }
		        ,btn2:function(index){
		        	layer.close(index);
		        }
			})
		},
		getBaseInfo(index){
			let base = this.baseList[index],selected = base.selected;
			base.selected = !base.selected;

			if(!selected)
				this.readyList.push(base);
			else
				this.readyList.forEach((item,idx)=>{
					if(item.id==base.id){
						this.readyList.splice(idx,1);
					}
				})
		},
		/** 点击规格事件 **/
		getInfo(pIndex,index){
			this.select(pIndex,index);
		},
		bindJQ(){
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
		/** 选中规格 **/
		select(pIndex,index){
			let before = this.classList;
			let after = this.selectedList;

			let parent = before[pIndex];//获取父及对象
			let current = parent.children[index];//获取当前点击对象
			let selected = current.selected;//当前点击对象是否选中
			current.selected = !selected;//赋值当前对象选中(取反)

			/** 加这段代码是因为修改的是二维数组下的属性,无法更新视图,通过splice方法可以实现视图更新 **/
			before[pIndex].children.splice(index,1,current);

			if(!selected){//如果点击的时候没有选中

				/** 判断当前点击对象的父及是否已经在已选中数据集中出现 **/
				let has = after.some((item,index)=>{
					let flag = item.id == parent.id;

					/** 如果已经存在，则在之前对象上追加子对象 **/
					flag && item.children.push(Object.assign({},current));
					return flag;
				})

				/** 如果不存在，则表示第一次增加 **/
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
								text:current.text,
								price:current.price,
								total:current.total,
								cost:current.cost,
								partnerPrice:current.partnerPrice,
								shopCode:current.shopCode,
								shopBarcodes:current.current,
								preImg:current.preImg,
								goodImg:current.goodImg,
								selected:current.selected
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
			}else{
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
			}
		},
		/** 取消选中组 **/
		unSelectedGroup(classIndex){
			this.classList.forEach((item,index)=>{
				if(classIndex == index){
					item.children.forEach((chid,i)=>{
						chid.selected = !1;
					})
				}
			})
		},
		/** 取消选中全部 **/
		unSelectedAll(){
			this.classList.forEach((item,index)=>{
				item.children.forEach((chid,i)=>{
					chid.selected = !1;
					item.children.splice(i,1,chid);
				})
			})
		},
		/** 全选 **/
		selectedAll(){
			this.classList.forEach((item,index)=>{
				item.children.forEach((chid,i)=>{
					chid.selected = !0;
					item.children.splice(i,1,chid);
				})
			})
		}
	}
})