(function(window,document){
	var w = window,
		doc = document,
		rootDoc;
	var DH = function(selector,context){
		return new DH.prototype.init(selector,context);
	};
	DH.merge = function(a,b){
		var i = a.length,
			j = 0;
		if(typeof b.length === "number"){
			for(var l = b.length;j < l;j++){
				a[i++] = b[j];
			}
		}else{
			while(b[j] != "undefined"){
				a[i++] = b[j++]; 
			}
		}
		a.length = i;
		return a;
	};
	DH.each = function(obj,callback){
		var i = 0;
		if(obj.length === undefined){
			for(i in obj){
				var result = callback.call(obj[i],i,obj[i]);
				if(result === false){
					break;
				}
			}
		}else{
			for(;i<obj.length;i++){
				var result = callback.call(obj[i],i,obj[i]);
				if(result === false){
					break;
				}
			}
		}
	};
	DH.prototype = {
		constructor:DH,
		length:0,
		selector:'',
		splice:[].splice,
		//初始化jQuery对象，暂时支持#id,.class,tag,或者selector为dom对象，构造成jQuery对象
		init:function(selector,context){
			//console.log(this);
			var context = context || doc,
				elem,
				ret;
			if(!selector){return this;}
			if(typeof selector === "string"){
				selector = selector.trim();
				if(document.querySelectorAll){
					elem = doc.querySelectorAll(selector);
				}else{
					var selec = selector.substring(1);
					switch(selector.charAt(0)){
						case '#':
							elem = context.getElementById(selec);
							break;
						case '.':
							var eles = doc.getElementsByTagName('*'),
								elem = [],
								reg = new RegExp('(^|\\s)'+selec+'(\\s|$)');
							for(var i = 0;i<eles.length;i++){
								if(reg.test(eles[i].className)){
									elem.push(eles[i]);
								}
							}
							break;
						case '*':
							elem = doc.getElementsByTagName('*');
							break;
						default:
							elem = doc.getElementsByTagName(selector);
					}
				}
			}
			if(typeof selector === 'function'){
				DH.ready(selector);
				return;
			}
			//console.log(elem);
			//参数为dom
			if(selector.nodeType){
				this[0] = selector;
				this.length = 1;
				this.context = selector;
				return this;
			}
			//参数为dom数组
			if(selector instanceof Array){
				elem = selector;
				for(var i=0;i<selector.length;i++){
					this[i] = selector[i];
				}
				this.length = selector.length;
				this.context = context;
				return this;
			}
			//ret = DH.merge(this,elem);
			for(var i=0,l = elem.length;i<l;i++){
				this[i] = elem[i];
			}
			this.selector = selector;
			//this.prevObject = this.length>0?this:rootDoc;
			this.context = context;
			this.length = elem.length;
			return this;
		},
		//判断是否有给定的class
		hasClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				if(reg.test(this[i].className)){
					return true;
				}
			}
			return false;
		},
		//添加class
		addClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				if(!reg.test(this[i].className)){
					this[i].className+=' '+cls;
				}
			}
			return this;
		},
		//移除class
		removeClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				this[i].className = this[i].className.replace(reg,' ');
			}
			return this;
		},
		//获取第index个值，如果为负数，则从后往前读取
		eq:function(index){
			console.log(this);
			return DH(index >= 0?this[index]:this[index+this.length]);
		},
		//获取第一个
		first:function(){
			return this.eq(0);
		},
		last:function(){
			return this.eq(-1);
		},
		siblings:function(){
			var r = [];
			for(var i = 0;i<this.length;i++){
				r = r.concat(DH.sibling(this[i].parentNode.firstChild,this[i]));
			}
			return DH(r);
		},
		get:function(index){
			return index >= 0?this[index]:this[index+this.length];
		},
		next:function(){
			var r = [];
			for(var i = 0;i<this.length;i++){
				var n = this[i];
				while(n = n.nextSibling){
					if(n.nodeType === 1){
						r = r.concat(n);
						break;
					}
				}
			}
			return DH(r);
		},
		prev:function(){
			var r = [];
			for(var i = 0;i<this.length;i++){
				var n = this[i];
				while(n = n.previousSibling){
					if(n.nodeType === 1){
						r = r.concat(n);
						break;
					}
				}
			}
			return DH(r);
		},
		parent:function(){
			var r = [];
			for(var i = 0;i<this.length;i++){
				var n = this[i].parentNode;
				r.push(n && n.nodeType !== 11?n:null);
			}
			return DH(r);
		},
		each:function(callback){
			DH.each(this,callback);
		},
		//获取或设置css，参数为一个，则获取样式，如果是对象，则设置所有样式，参数为两个则设置一个样式
		css:function(attr,value){
			if(arguments.length == 1){
				if(typeof attr == 'string'){
					return this[0].currentStyle?this[0].currentStyle[attr]:getComputedStyle(this[0],false)[attr];
				}else{
					for(var i=0;i<this.length;i++){
						for(var key in attr){
							$(this[i]).css(key,attr[key]);
						}
					}
				}
			}else if(arguments.length == 2){
				for(var i=0;i<this.length;i++){
					switch(attr){
						case 'width':
						case 'height':
						case 'left':
						case 'top':
						case 'bottom':
						case 'right':
							this[i].style[attr] = value + 'px';
							break;
						case 'opacity':
							this[i].style.opacity = value;
							this[i].style.filter = 'alpha(opacity='+value+')';
							break;
						default:
							this[i].style[attr] = value; 
							break;
					}
				}
			}
			return this;
		},
		attr:function(attr,val){
			if(arguments.length === 1){
				if(typeof attr === "string"){
					return this[0].getAttribute(attr);
				}else{
					var _this = this;
					DH.each(attr,function(key,element){
						_this.each(function(){
							this.setAttribute(key,element);
						})
					})
				}
			}else if(arguments.length === 2){
				this.each(function(){
					this.setAttribute(attr,val);
				})
			}
			return this;
		},
		removeAttr:function(name){
			this.each(function(){
				this.removeAttribute(name);
			})
		},
		data:function(attr,val){
			if(arguments.length === 1){
				if(typeof attr === "string"){
					return this[0].getAttribute('data-'+attr);
				}else{
					var _this = this;
					DH.each(attr,function(key,element){
						_this.each(function(){
							this.setAttribute('data-'+key,element);
						})
					})
				}
			}else if(arguments.length === 2){
				this.each(function(){
					this.setAttribute('data-'+attr,val);
				})
			}
			return this;
		},
		removeData:function(name){
			this.each(function(){
				this.removeAttribute('data-'+name);
			})
		},
		html:function(value){
			if(value === undefined){
				return this[0].innerHTML;
			}else{
				this.each(function(){
					this.innerHTML = value;
				})
				return this;
			}
		},
		remove:function(){
			this.each(function(){
				this.parentNode.removeChild(this);
			})
			return this;
		}
		//用下面的来替换，避免重复的代码
		/*before:function(value){
			this.each(function(){
				if(typeof value === 'string'){
					this.insertAdjacentHTML('beforeBegin',value);
				}else{
					this.parentNode.insertBefore(value.cloneNode(true),this);
				}
			})
			value.parentNode && value.parentNode.removeChild(value);
			return this;
		},
		after:function(value){
			this.each(function(){
				if(typeof value === 'string'){
					this.insertAdjacentHTML('afterEnd',value);
				}else{
					this.parentNode.insertBefore(value.cloneNode(true),this.nextSibling);
				}
			})
			value.parentNode && value.parentNode.removeChild(value);
			return this;
		},
		append:function(value){
			this.each(function(){
				if(typeof value === 'string'){
					this.insertAdjacentHTML('beforeEnd',value);
				}else{
					this.appendChild(value.cloneNode(true));
				}
			})
			value.parentNode && value.parentNode.removeChild(value);
			return this;
		},
		prepend:function(value){
			this.each(function(){
				if(typeof value === 'string'){
					this.insertAdjacentHTML('afterBegin',value);
				}else{
					this.insertBefore(value.cloneNode(true),this.firstChild);
				}
			})
			value.parentNode && value.parentNode.removeChild(value);
			return this;
		},*/
	};
	//采用了一种设计模式，避免上面的重复的代码。支持html和dom元素，参数为html时使用insertAdjacentHTML,有4个参数。
	DH.each({
		before:['beforeBegin',function(value){this.parentNode.insertBefore(value.cloneNode(true),this);}],
		after:['afterEnd',function(value){this.parentNode.insertBefore(value.cloneNode(true),this.nextSibling);}],
		append:['beforeEnd',function(value){this.appendChild(value.cloneNode(true));}],
		prepend:['afterBegin',function(value){this.insertBefore(value.cloneNode(true),this.firstChild);}]
	},function(key,str){
		DH.prototype[key] = function(value){
			this.each(function(){
				if(typeof value === 'string'){
					this.insertAdjacentHTML(str[0],value);
				}else{
					str[1].call(this,value);
				}
			})
			//如果dom元素存在，需要移除，上面是使用复制的元素来添加
			value.parentNode && value.parentNode.removeChild(value);
			return this;
		}
	});
	//将DH的prototype赋值给init的prototype，可以链式调用
	DH.prototype.init.prototype = DH.prototype;
	rootDoc = DH(doc);
	/*
		DH.ajax({
			url:'http://127.0.0.1/testajax.php',
			success:function(data){console.log(data);},
			type:'POST',
			data:'name=haha&age=22',
			error:function(){console.log('失败')}
		})
		DH.ajax({
			url:'http://127.0.0.1/testajax.php',
			success:function(data){console.log(data);},
			error:function(){console.log('失败')}
		})
		支持为对象
		DH.post({
			url:'http://127.0.0.1/testajax.php',
			success:function(data){console.log(data);},
			type:'POST',
			data:{name:'haha',age:22},
			error:function(){console.log('失败')}
		})
	*/
	DH.ajax = function(options){
		var xhr = null;
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		}else{
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xhr.open(options.type?options.type:'GET',options.url,true);
		if(options.type === 'POST'){
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			var d = '';
			if(options.data){
				if(typeof options.data === 'object'){
					for(var key in options.data){
						d = d+key+'='+options.data[key]+'&';
					}
					d = d.substring(0,d.length-1);
				}else{
					d = options.data;
				}
			}else{
				d = null;
			}
			xhr.send(d);
		}else{
			xhr.send(null);
		}
		xhr.onreadystatechange = function(){
			var result;
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					result = xhr.responseText;
					//result = window.JSON?JSON.parse(result):eval('('+result+')');
					options.success && options.success(result);
				}else{
					options.error && options.error();
				}
			}
		}
	};
	DH.get = function(opt){
		opt.type = 'GET';
		DH.ajax(opt);
	};
	DH.post = function(opt){
		opt.type = 'POST';
		DH.ajax(opt);
	};
	DH.sibling = function(n,elem){
		var r = [];
		while(n = n.nextSibling){
			if(n.nodeType === 1 && n !== elem){
				r.push(n);
			}
		}
		return r;
	};
	//这里假设全是domReady
	DH.ready = function(fn){
		doc.addEventListener('DOMContentLoaded',function(){
			fn && fn();
			doc.removeEventListener('DOMContentLoaded',fn,false);
		},false);
	};
	window.DH = DH;
})(window,document);