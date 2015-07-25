$(function(){
	//页面加载时，检测localstorage里有无文件夹
	var nowfold,nownote,rightclick,del;
	if(localStorage.foldlists){
		var folds = JSON.parse(localStorage.foldlists);
		var html = '';
		for(var k in folds){
			html=html+'<li url='+k+'><a href=#'+k+'>'+folds[k]+'</a></li>';
		}
		$('#foldlists>ul').html(html);
	}
	else{
		var folds = {};
	}
	//添加文件夹
	$(document).on("click","#addfold",function(){
		var addinput = document.createElement('input');
		$("#foldlists>ul").append(addinput);
		$(addinput).focus();
		$(addinput).blur(function(){
			var value = $(this).val();
			if(value){
				var l = 'fold'+getms();
				var li = '<li url='+l+'><a href=#'+l+'>'+value+'</a></li>';
				$("#foldlists>ul").append(li);
				folds[l] = value;
				localStorage.foldlists = JSON.stringify(folds);
				var temp = {};
				localStorage[l] = JSON.stringify(temp);
			}
			$(this).remove();
		})
	})
	//点击文件夹，显示笔记列表
	$(document).on('click','#foldlists>ul>li',function(){
		$('#foldlists>ul>li').removeClass('click');
		$('#notelists>ul').html('');
		$('#doc>div').hide();
		$(this).addClass('click');
		nowfold = $(this);
		var url = $(this).attr('url');
		if(localStorage[url]){
			var notes = JSON.parse(localStorage[url]);
			var html = '';
			for(var k in notes){
				html=html+'<li url='+k+'><a href=#'+k+'>'+notes[k]+'</a></li>';
			}
			$('#notelists>ul').html(html);
		}
	});
	//新建文件
	$(document).on('click','.newnote',function(){
		var fold = $('#foldlists>ul').find('li.click');
		if(fold.length != 0){
			$('#doc>div').show();
			$('#edit').text('保存');
			$('#head>input').val('新笔记');
			$('#note').html('<textarea></textarea>');
			$('#edit').addClass('new');
		}else{
			alert('请先建文件夹或选择文件夹');
		}
	});
	//编辑或保存的点击事件，分三种情况，一是新建文件时的保存，二是其他时候的保存，三是编辑
	$(document).on('click','#edit',function(){
		if($(this).hasClass('new')){
			var l = nowfold.attr('url');
			if(localStorage[l]){
				var temp = JSON.parse(localStorage[l]);
			}else{
				var temp = {};
			}
			var name = 'note'+getms();
			temp[name] = $('#head>input').val();
			localStorage[l] = JSON.stringify(temp);
			var ta = $('#note>textarea').val();
			localStorage[name] = JSON.stringify(ta);
			$('#notelists>ul').append('<li url='+name+'><a href=#'+name+'>'+$('#head>input').val()+'</a></li>');
			nownote = $('#notelists>ul>li[url='+name+']');
			nownote.siblings('li').removeClass('click');
			nownote.addClass('click');
			var u = nownote.attr('url');
			$(this).removeClass('new');
			$(this).text('编辑');
			document.getElementById('note').innerHTML = marked(ta);
		}else{
			var u = nownote.attr('url');
			if($(this).text()=='编辑'){
				$(this).text('保存');
				var area = document.createElement('textarea');
				area.value = JSON.parse(localStorage[u]);
				$('#note').html(area);
			}else{
				$(this).text('编辑');
				var l = nowfold.attr('url');
				var ta = $('#note>textarea').val();
				var input = $('#head>input').val();
				localStorage[l][u] = JSON.stringify(input);
				localStorage[u] = JSON.stringify(ta);
				document.getElementById('note').innerHTML = marked(ta);
				$('#notelists>ul>li[url='+u+']').find('a').text(input);
			}
		}
	});
	//点击笔记列表时的事件
	$(document).on('click','#notelists>ul>li',function(){
		$(this).siblings('li').removeClass('click');
		$(this).addClass('click');
		$('#doc>div').show();
		$('#edit').text('编辑');
		nownote = $(this);
		var u = $(this).attr('url');
		var c = JSON.parse(localStorage[u]);
		$('#head>input').val($(this).find('a').text());
		document.getElementById('note').innerHTML = marked(c);
	});
	$(document).on('mouseover','#notelists>ul>li,#foldlists>ul>li',function(){
		rightclick = $(this);
	}).on('mouseout','#notelists>ul>li,#foldlists>ul>li',function(){
		rightclick = null;
	})
	$(document).on('click',function(){
		$('#menu').css("visibility","hidden");
	})
	document.oncontextmenu = function(e){
		var e = e||window.event;
		if(rightclick){
			del = rightclick;
			if(rightclick.parents('#notelists').length!=0){
				$('#menu>ul').html('<li>删除笔记</li>');
			}else{
				$('#menu>ul').html('<li>删除文件夹</li>');
			}
			$('#menu').css({"left":e.clientX,"top":e.clientY,"visibility":"visible"});
			return false;
		}
	};
	$(document).on('click','#menu li',function(){
		if(del){
			$('#menu').css("visibility","hidden");
			if(del.parents('#notelists').length!=0){
				if(confirm('删除笔记'+del.find('a').text())){
					var u = del.attr('url');
					var fu = nowfold.attr('url');
					if(localStorage[u]){
						localStorage.removeItem(u);
					}
					var temp = JSON.parse(localStorage[fu]);
					delete temp[u];
					localStorage[fu] = JSON.stringify(temp);
					del.remove();
					$('#doc>div').hide();
				}
			}else{
				if(confirm('删除文件夹'+del.find('a').text())){
					var u = del.attr('url');
					var l = JSON.parse(localStorage[u]);
					for(var k in l){
						if(localStorage[k]){
							localStorage.removeItem(k);
						}
					}
					localStorage.removeItem(u);
					var temp = JSON.parse(localStorage.foldlists);
					delete temp[u];
					localStorage.foldlists = JSON.stringify(temp);
					del.remove();
					$('#notelists>ul').html('');
					$('#doc>div').hide();
				}
			}
			del = null;
		}
	})
})
function getms(){
	var date = new Date();
	return date.getTime();
}