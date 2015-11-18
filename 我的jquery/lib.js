(function(window,document){
	var w = window,
		doc = document;
	var DH = function(selector,context){
		return new DH.prototype.init(selector,context);
	}
	DH.prototype = {
		constructor:DH,
		init:function(selector,context){
			var selector = selector.trim(),
				context = context || doc,
				elem;
			if(!selector){return this;}
			if(typeof selector === "string"){
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
				for(var i = 0;i<elem.length;i++){
					this[i] = elem[i];
				}
				this.selector = selector;
				this.context = context;
				this.length = elem.length;
				return this;
			}else if(selector.nodeType){
				this[0] = selector;
				this.length = 1;
				this.context = selector;
				return this;
			}
		},
		hasClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				if(reg.test(this[i].className)){
					return true;
				}
			}
			return false;
		},
		addClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				if(!reg.test(this[i].className)){
					this[i].className+=' '+cls;
				}
			}
			return this;
		},
		removeClass:function(cls){
			var reg = new RegExp('(^|\\s)'+cls+'(\\s|$)');
			for(var i=0;i<this.length;i++){
				this[i].className = this[i].className.replace(reg,' ');
			}
			return this;
		},
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
	}
	//将DH的prototype赋值给init的prototype，可以链式调用
	DH.prototype.init.prototype = DH.prototype;

	DH.ajax = function(){

	}

	window.DH = DH;
})(window,document);