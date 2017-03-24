// 网易教育产品部 大作业 JS文件  dphe@q163.com

window.onload = function(){
	netEase.app.topNotice();
	netEase.app.toBanner();
	netEase.app.toScroll();
	netEase.app.toChangeColor();
};

var netEase = {};//命名空间

netEase.tools = {};//底层工具层
	// getElementsByClassName封装
	netEase.tools.getByClass = function(oParent,sClass){
		var aEle = oParent.getElementsByTagName('*');
		var arr = [];
		
		for(var i=0;i<aEle.length;i++){
			if(aEle[i].className == sClass){
				arr.push(aEle[i]);
			}
		}
		
		return arr;
	};
	//getStyleOpacity
	netEase.tools.getStyle = function(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		else{
			return getComputedStyle(obj,false)[attr];
		}
	};

netEase.ui = {};//UI组件层
	netEase.ui.setCookie = function(name, value, expires) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expires);
		document.cookie=name+ "=" +escape(value)+
		((expires==null) ? "" : ";expires="+exdate.toGMTString());
	};
	netEase.ui.getCookie = function(name) {
	  if (document.cookie.length>0){
	      startName=document.cookie.indexOf(name + "=");
	      if (startName!=-1){
	         startName = startName + name.length+1;
	         endName=document.cookie.indexOf(";",startName);
	         if (endName == -1) endName = document.cookie.length;
	         return unescape(document.cookie.substring(startName,endName));
	      }
	    }
	  return "";
	};
	netEase.ui.fadeIn = function(obj){
		var value = 0; // 500ms 淡入,也就是让opacity的值从0到1;那就定义一个value值.
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var iSpeed = 5;
			if(value == 100){
				clearInterval(obj.timer);
			}else{
				value += iSpeed;
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+')';
			};
			
		},25);
	};
	netEase.ui.fadeOut = function(obj){
		//设计稿没有定义淡出,自主添加,可通过沟通修改...
		var value = 100; // 500ms 淡出,也就是让opacity的值从1到0;那就定义一个value值.
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var iSpeed = -5;
			if(value == 0){
				clearInterval(obj.timer);
			}else{
				value += iSpeed;
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+')';
			};
			
		},25);
	};

netEase.app = {};//应用层
	//通知条控制
	netEase.app.topNotice = function(){
		var oTop = document.getElementById('top');
		var oClose = document.getElementsByClassName('close')[0];
	    //页面加载时检测cookie
		if(netEase.ui.getCookie("topNotice")==="true"){
			oTop.style.display = "none";
		}else{
			oTop.style.display = "block";
		}
		//关闭广告
		oClose.onclick=function(){
			oTop.style.display="none";
			netEase.ui.setCookie("topNotice","true","365");
		};		
	};
	netEase.app.toBanner = function(){
		var oBanner = document.getElementById('banner');
		var aLi = oBanner.getElementsByTagName('li');
		var aBtn = oBanner.getElementsByTagName('span');

		//自动轮播:
		var timer = setInterval(autoPlay,5000); //淡入淡出是一个小动作,整体轮播是一个大动作.
		var iNow = 0;
		function autoPlay(){
			if(iNow == aLi.length-1){
				iNow = 0;
			}
			else{
				iNow++;
			}
			show(iNow);
		}
		function show(q){
			for(var i=0;i<aLi.length;i++){

				netEase.ui.fadeOut(aLi[i]);  //利用淡出来全部隐藏.
				aBtn[i].className = '';
			}
			netEase.ui.fadeIn(aLi[q]); //利用淡入来显示.
			aBtn[q].className = 'btns-selected';
		}

		//1.手动轮播：把选中按钮和图片添加相应类名，把原来选中的按钮和图片取消相应类名
		for(i=0;i<aBtn.length;i++){
			aBtn[i].index=i;//给每个按钮添加一个序号
			aBtn[i].onmouseover=function(){
				clearInterval(timer);
				if(this.className=="btns-selected"){return;}//选中当前已选中的，则不操作
				show(this.index);
			}
			aBtn[i].onmouseout=function(){
				n=this.index+1;
				timer = setInterval(autoPlay,5000);
			}
			aLi[i].onmouseover = function(){
				clearInterval(timer);
			};
			aLi[i].onmouseout  = function(){
				timer = setInterval(autoPlay,5000);
			};
		};
	};
	netEase.app.toScroll = function(){
		var oScroll = document.getElementById("scroll");
		var oUl = oScroll.getElementsByTagName("ul")[0];
		var oLi = oUl.getElementsByTagName("li");
		var oimg = document.getElementsByClassName("aImg");
		var timer = null;

		oUl.innerHTML += oUl.innerHTML; //放置重复的两套
		oUl.style.width = oLi[0].offsetWidth*oLi.length+"px";//让ul的宽度足够的宽.
		var a = true;
		for (var i = 0; i < oimg.length; i++) {

		oimg[i].onmouseover = function(){
		   a = false;
		}
		oimg[i].onmouseout = function(){
		   a = true;
		}
		function scroll(){

			if(a){
				oUl.style.left = oUl.offsetLeft -2 +"px";

				if(oUl.offsetLeft< -oUl.offsetWidth/2){
					oUl.style.left = 0;
				}
			}
			};
		}
		timer = setInterval(scroll,50);
	};
	netEase.app.toChangeColor = function(){
		var oCourse = document.getElementById('course');
		var aLi = oCourse.getElementsByTagName('li');
		var aH3 = oCourse.getElementsByTagName('h3');

		for (var i = 0; i < aLi.length; i++) {
			aLi[i].index = i;
			aLi[i].onmouseover = function(){
				aH3[this.index].style.color = "#39a030";
			};
			aLi[i].onmouseout = function(){
				aH3[this.index].style.color = "#5a5a5a";
			};
		}
	}







