// 网易教育产品部 大作业 JS文件  cangdow

window.onload = function(){
	netEase.app.topNotice();
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
