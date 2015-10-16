;(function(){
	var $ = {
		noConflict:function(){
			return $;
		},
		byId:function(id){
			return typeof id == 'string'?document.getElementById(id):id;
		},
		byTag:function(tag,ele){
			return (ele || document).getElementsByTagName(tag);
		},
		byClass:function(className,ele){
			var eles = $.byTag('*',ele),
				arr=[],
				reg = new RegExp('(^|\\s)'+className+'(\\s|$)');
			for(var i = 0;i<eles.length;i++){
				if(reg.test(eles[i].className)){
					arr.push(eles[i]);
				}
			}
			return arr;
		},
		css:function(obj,attr,value){
			if(arguments.length == 2){
				if(typeof attr == 'string'){
					return obj.currentStyle?obj.currentStyle[attr]:obj.getComputedStyle(obj,false)[attr];
				}else{
					for(var key in attr){
						css(obj,key,attr[key]);
					}
				}
			}else if(arguments.length == 3){
				switch(attr){
					case 'width':
					case 'height':
					case 'left':
					case 'top':
					case 'bottom':
					case 'right':
						obj.style[attr] = value + 'px';
						break;
					case 'opacity':
						obj.style.opacity = value;
						obj.style.filter = 'alpha(opacity='+value+')';
						break;
					default:
						obj.style[attr] = value; 
						break;
				}
			}
		},
		move:function(obj,json,fn){
			clearInterval(obj.timer);
			obj.timer = setInterval(function(){
				var stop = true;
				for(var attr in json){
					var iCur = 0;
					if(attr == 'opacity'){
						iCur = parseInt(parseFloat(css(obj,attr))*100);
					}else{
						iCur = parseInt(css(obj,attr));
					}
					var iSpeed = (json[attr] - iCur)/8;
					iSpeed = iSpeed > 0?Math.ceil(iSpeed):Math.floor(iSpeed);
					if(iCur!=json[attr]){
						stop = false;
						css(obj,attr,iCur+iSpeed);
					}
				}
				if(stop){
					clearInterval(obj.timer);
					fn && fn();
				}
			},30);
		}
	}
	window.$?window['dh'] = $:window.$ = window['dh'] = $;
})()

