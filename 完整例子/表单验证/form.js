(function($,window,document,undefined){
	var _form = function(ele,opt){
		this.ele = ele;
		this.options = $.extend({},opt);
	}
	_form.prototype = {
		init:function(){
			var ei = this;
			ei._load();
			
		}
	}
	$.fn.form = function(options){
		var validation = new _form(this,options);
		return validation.init();
	};
})(jQuery,window,document)
