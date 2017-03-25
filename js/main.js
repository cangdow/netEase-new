// 网易教育产品部 大作业 JS文件  dphe@q163.com

window.onload = function(){
	netEase.app.topNotice();
	netEase.app.toBanner();
	netEase.app.toScroll();
	netEase.app.toChangeColor();
	netEase.app.setAjax();
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
	netEase.tools.ajax = function(obj){
		var xhr = (function () {
			/*创建XMLHttpRequest对象*/
			if (typeof XMLHttpRequest != 'undefined') {
				// code for IE7+, Firefox, Chrome, Opera, Safari
				return new XMLHttpRequest();
			} else if (typeof ActiveXObject != 'undefined') {
				// code for IE6, IE5
				var version = [
											'MSXML2.XMLHttp.6.0',
											'MSXML2.XMLHttp.3.0',
											'MSXML2.XMLHttp'
				];
				for (var i = 0; version.length; i ++) {
					try {
						return new ActiveXObject(version[i]);
					} catch (e) {
						//跳过
					}	
				}
			} else {
				throw new Error('您的系统或浏览器不支持XHR对象！');
			}
		})();
		/*url加随机参数，防止缓存*/
		obj.url = obj.url + '?rand=' + Math.random();
		/*请求参数格式化，encodeURIComponent编码参数可以出现&*/
		obj.data = (function (data) {
			var arr = [];
			for (var i in data) { 
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
			}
			return arr.join('&');
		})(obj.data);
		if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
		if (obj.async === true) {
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					callback();
				}
			};
		}
		xhr.open(obj.method, obj.url, obj.async);
		if (obj.method === 'post') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(obj.data);	
		} else {
			xhr.send(null);
		}
		if (obj.async === false) {
			callback();
		}
		function callback() {
			if (xhr.status == 200) {
				obj.success(xhr.responseText);			//回调传递参数
			} else {
				alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
			}	
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
	netEase.app.setAjax = function(){
		netEase.tools.ajax({
		    method : 'get',
		    url : 'http://study.163.com/webDev/couresByCategory.htm',
		    data : {
		        'pageNo':'1',
		        'psize':'20',
		        'type':'10'
		    },
		    success : function (data) {
		        console.log(data);
		        var _data= JSON.parse(data);
		        var oDiv = document.getElementById("okdklkd");
		        for(i=0;i<_data.list.length;i++){
			var oLi = document.createElement("li");
			oDiv.appendChild(oLi);
			var _img = document.createElement("img");
			var _name = document.createElement("p");
			var _price = document.createElement("p");
			var _description = document.createElement("p");
			_img.setAttribute("id", "okmy");
			_img.setAttribute("src", _data.list[i].bigPhotoUrl);
			_name.setAttribute("class", "okmyy");
			_name.innerHTML=_data.list[i].name;
			_price.innerHTML="价格："+_data.list[i].price;
			_description.innerHTML=_data.list[i].description;
			oLi.appendChild(_img);
			oLi.appendChild(_name);
			oLi.appendChild(_price);
			oLi.appendChild(_description);
		        }
		    },
		    async : true
		});		
	};
	
/*以下还有不少不大理解的地方,参考网友的大部分方法.*/

(function(){

/*关注和登录模块*/
var follow_module = (function(){

    var follow = document.querySelector('.follow');
    var closeTip = document.querySelector('.u-notips');
    var loginMask = document.querySelector('.m-mask');

    // 登录模块
    var login_module = (function(){

        var form = document.forms.loginForm;
        var itmAccount = document.querySelector('.itm1');
        var itmPassword = document.querySelector('.itm2');
        var cancelBtn = document.querySelector('.m-form .closed');
        var accountLab = document.querySelector('.itm1 .lab');
        var passwordLab = document.querySelector('.itm2 .lab');
    
        function disableSubmit(disabled){
            form.loginBtn.disabled = !!disabled;
            if (!disabled) {
                removeClass(form.loginBtn,'j-disabled');
            }
            else{
                addClass(form.loginBtn,'j-disabled');
            }
        }
    
        function invalidInput(node,msg){
            addClass(node,'j-error');
        }
    
        function clearInvalid(node){
            removeClass(node,'j-error');
        }
    
        addEvent(form,'keydown',function(event){
                var event = event || window.event;
                var target = event.target || event.srcElement;
                var parentTarget = target.parentNode;
                var lab = parentTarget.querySelector('.lab');
                lab.style.display = 'none';
                // 还原错误状态
                clearInvalid(target.parentNode);
                // 还原登录按钮状态
                disableSubmit(false);
            }
        );

        function blurHandler(event){
            var event = event || window.event;
            var target = event.target || event.srcElement;
            var parentTarget = target.parentNode;
            var lab = parentTarget.querySelector('.lab');
            if (target.value == ''){
                lab.style.display = 'block';
            }
        }

        addEvent(form.account,'blur',blurHandler);

        addEvent(form.password,'blur',blurHandler);
    
        addEvent(form,'submit',function(event){
                // 密码验证
                var input = form.password,
                    pswd = input.value,
                    account = form.account.value;

                if (account == ''){
                    // event.preventDefault();
                    invalidInput(itmAccount);
                    return;
                }else if(pswd == ''){
                    // event.preventDefault();
                    invalidInput(itmPassword);
                    return;
                }

                var options = {userName:md5(account),password:md5(pswd)};
                var url = 'http://study.163.com/webDev/login.htm';
                console.log(options);
                function fu(response){
                    // 还原登录按钮状态
                    disableSubmit(false);
                    if (response == 1) {
                        form.reset();
                        loginMask.style.display = 'none';
                        setCookie('loginSuc',1,new Date(9999,9));
                        followAPI();
                    }
                    else{
                        alert('账号密码错误');
                    }
                }
                get(url,options,fu);

                preventDefault(event);
                // 禁用提交按钮
                disableSubmit(true);
            }
        );

        addClickEvent(cancelBtn,function(){
            form.reset();
            accountLab.style.display = 'block';
            passwordLab.style.display = 'block';
            loginMask.style.display = 'none';
        });
        
    })();    

    // followAPI
    function followAPI(){
        var url = 'http://study.163.com/webDev/attention.htm';
        get(url,null,function(response){
            if (response == 1) {
                setCookie('followSuc',1,new Date(9999,9));
                // 重新设置关注按钮
                setFollowbtn();
            };
        })
    }

    function setFollowbtn(){
        var cookie = getCookie();
        var followBtn = document.querySelector('.follow');
        var followedBtn = document.querySelector('.followed');
        if (cookie.followSuc == 1) {
            followBtn.style.display = 'none';
            followedBtn.style.display = 'block';
        }
        else{
            followBtn.style.display = 'block';
            followedBtn.style.display = 'none';
        }
    }

    addClickEvent(follow,function(event){
        var event = event || window.event;
        var cookie = getCookie();
        if (!cookie.loginSuc) {
            loginMask.style.display = 'block';
        }
        else{
            followAPI();
        }
        
        preventDefault(event);
        
    });

    setFollowbtn();

})();


/*视频模块*/
var video_module = (function(){

    var videoMask = document.querySelector(".j-video");
    var videoPlay = document.querySelector(".j-play");
    var closeVideo = document.querySelector(".m-video .closed");
    var video = document.querySelector(".m-video video");

    addClickEvent(videoPlay,function(event){
        videoMask.style.display = 'block';
    });

    addClickEvent(closeVideo,function(event){
        videoMask.style.display = 'none';
        if (video && !video.paused) {
            video.pause();
        };
    });

})();

/*课程列表及分页模块*/
var course_module = (function(){

    var url = "http://study.163.com/webDev/couresByCategory.htm";
    var pageSize = 20;
    var pageType = 10;

    var mnav = document.querySelector('.m-nav');
    var mnavTag = mnav.getElementsByTagName('a');
    var mpager = document.querySelector('.m-pager');

    delegateEvent(mnav,'a','click',
        function(target,event){
            if(pageType != target.getAttribute('data')){
                for(i=0;i<mnavTag.length;i++){
                    removeClass(mnavTag[i],'selected');        
                }
                addClass(target,'selected');
                pageType = target.getAttribute('data');
                mpager.innerHTML = '';
                getPageNum(1);
            }
            preventDefault(event);
        }
    );

    //获取分页器总页数以及课程列表第一页
    function getPageNum(now){    
        var options = {pageNo:now,psize:pageSize,type:pageType};
        get(url,options,function(response){
                initPager(response,now);
            }
        );    
    }
    //初始化分页和课程列表
    function initPager(response,now){
        var res = JSON.parse(response);
        var option = {id:mpager,nowNum:now,allNum:res.totalPage,childLength:8,callback:getCourse};
        //初始化课程列表
        drawCourse(response);
        //初始化分页
        page(option);
    }
    //获取课程列表
    function getCourse(now,all){
        console.log('分页器：'+now);
        
        var options = {pageNo:now,psize:pageSize,type:pageType};
        get(url,options,drawCourse);
    }
    //生成课程列表
    function drawCourse(response){
        var data = JSON.parse(response);
        console.log(data);
        console.log('获取的页码：'+data.pagination.pageIndex);
        
        var boo = document.querySelectorAll('.u-cover');
        for(var i=boo.length-1;i>0;i--){
            boo[i].parentNode.removeChild(boo[i]);
        }
        
        var templete = document.querySelector('.m-data-lists .f-templete');
            
        for(var i=0,list=data.list;i<list.length;i++){       
            var cloned = templete.cloneNode(true);
            removeClass(cloned,'f-templete');
            var imgpic = cloned.querySelector('.imgpic');
            var title = cloned.querySelector('.tt');
            var orgname = cloned.querySelector('.orgname');
            var hot = cloned.querySelector('.hot');
            var pri = cloned.querySelector('.pri');
            var kindname = cloned.querySelector('.kindname');
            var disc = cloned.querySelector('.disc');
            
            imgpic.src = list[i].middlePhotoUrl;
            imgpic.alt = list[i].name;
            title.innerText = list[i].name;
            orgname.innerText = list[i].provider;
            hot.innerText = list[i].learnerCount;
            pri.innerText = '￥' + list[i].price + '.00'; 
            kindname.innerText = list[i].categoryName;
            disc.innerText = list[i].description;      
            templete.parentNode.appendChild(cloned);
        }
    }

    getPageNum(1);    

})();

/*热门推荐及滚动模块*/
var top_module = (function(){

    var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';

    var oUl = document.querySelector('.m-toplit');
    var aLi = oUl.getElementsByTagName('li');

    //获取热门排行课程数据
    get(url,null,initTop);

    //初始化热门课程列表
    function initTop(response,now){
        var list = JSON.parse(response);
        console.log(list);

        var templete = document.querySelector('.m-toplit .f-templete');
            
        for(var i=0;i<list.length;i++){       
            var cloned = templete.cloneNode(true);
            removeClass(cloned,'f-templete');
            var imgpic = cloned.querySelector('.imgpic');
            var title = cloned.querySelector('.tt');
            var num = cloned.querySelector('.num');
            
            imgpic.src = list[i].smallPhotoUrl;
            imgpic.alt = list[i].name;
            title.innerText = list[i].name;
            num.innerText = list[i].learnerCount;       
            templete.parentNode.appendChild(cloned);
        }

        setInterval(scroll,5000);

        function scroll(){
            var oLi = aLi[20].cloneNode(true);
            oUl.insertBefore(oLi,aLi[1]);
            startMove(oUl,{bottom:-990},function(){
                oUl.removeChild(aLi[21]);
                oUl.style.bottom = '-900px';
            });
        }
    }    

})();

/*运动模块，*/
var startMove = (function(){
    return function(obj,json,times,fx,fn){
    
        if( typeof times == 'undefined' ){
            times = 400;
            fx = 'linear';
        }
        
        if( typeof times == 'string' ){
            if(typeof fx == 'function'){
                fn = fx;
            }
            fx = times;
            times = 400;
        }
        else if(typeof times == 'function'){
            fn = times;
            times = 400;
            fx = 'linear';
        }
        else if(typeof times == 'number'){
            if(typeof fx == 'function'){
                fn = fx;
                fx = 'linear';
            }
            else if(typeof fx == 'undefined'){
                fx = 'linear';
            }
        }
        
        var iCur = {};
        
        for(var attr in json){
            iCur[attr] = 0;
            
            if( attr == 'opacity' ){
                iCur[attr] = Math.round(getStyle(obj,attr)*100);
            }
            else{
                iCur[attr] = parseInt(getStyle(obj,attr));
            }
            
        }
        
        var startTime = now();
        
        clearInterval(obj.timer);
        
        obj.timer = setInterval(function(){
            
            var changeTime = now();
            
            var t = times - Math.max(0,startTime - changeTime + times);  //0到2000
            
            for(var attr in json){
                
                var value = Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);
                
                if(attr == 'opacity'){
                    obj.style.opacity = value/100;
                    obj.style.filter = 'alpha(opacity='+value+')';
                }
                else{
                    obj.style[attr] = value + 'px';
                }
                
            }
            
            if(t == times){
                clearInterval(obj.timer);
                if(fn){
                    fn.call(obj);
                }
            }
            
        },13);
        
        function getStyle(obj,attr){
            if(obj.currentStyle){
                return obj.currentStyle[attr];
            }
            else{
                return getComputedStyle(obj,false)[attr];
            }
        }
        
        function now(){
            return (new Date()).getTime();
        }

        // Tween算法,jQuery使用的算法
        var Tween = {
            linear: function (t, b, c, d){  //匀速
                return c*t/d + b;
            }
        }
        
    }
})();

/*分页模块，*/
var page = (function(){
    return function(opt){
        if(!opt.id){
            return false;
        };
        var obj = opt.id;
        var nowNum = opt.nowNum || 1;
        var childLength = opt.childLength;
        var allNum = opt.allNum || childLength;
        var callback = opt.callback || function(){};
        // 可显示页数二分之一+1的位置
        var point = Math.floor(childLength/2) + 1;
        // 页数生成
        var pageInit = function(i){
            var oA = document.createElement('a');
            oA.setAttribute('index',i);
            oA.className = 'pg';
            oA.innerText = i;
            if(nowNum == i){
                addClass(oA,'selected');
            }
            return oA;
        }
        //当前页不等于1时上一页可选
        var oA = document.createElement('a');    
        oA.innerText = '上一页';
        oA.setAttribute('index',nowNum - 1);
        if(nowNum != 1){
            oA.className = 'prv';
        }
        else{
            oA.className = 'prv f-dis';
        }    
        obj.appendChild(oA);
        
        //生成具体页数，总页数小于等于可显示页数的情况
        if(allNum <= childLength){
            for(var i=1; i <= allNum; i++){ 
                var oA = pageInit(i);
                obj.appendChild(oA);
            }
        }
        //生成具体页数，总页数大于可显示页数的情况
        else{
            for(var i=1; i <= childLength; i++){
                //当前页是小于一半+1的可显示页数
                if(nowNum < point){
                    var oA = pageInit(i);
                }
                //当前页是倒数第1或倒数第2
                else if(allNum - nowNum <= point){
                    var oA = pageInit(allNum - childLength +i);
                }
                //当前页在可显示页数一半+1的位置显示，例如可以显示8页，当前页就在第5个位置
                else{
                    var oA = pageInit(nowNum - point + i);
                }            
                obj.appendChild(oA);
            }
        }
        //当前页不是最后一页时显示下一页
        var oA = document.createElement('a');    
        oA.innerText = '下一页';    
        oA.setAttribute('index',nowNum + 1);
        if(allNum != nowNum){
            oA.className = 'nxt';
        }
        else{
            oA.className = 'nxt f-dis';
        }
        obj.appendChild(oA);
        
        //用addevent会重复注册
        var aA = obj.getElementsByTagName('a');
        for(var i=0;i<aA.length;i++){
            aA[i].onclick=function(){
                if(nowNum != parseInt(this.getAttribute('index'))){
                    var nowNum = parseInt(this.getAttribute('index'));
                    obj.innerHTML = '';
                    page({
                        id:opt.id,
                        nowNum:nowNum,
                        allNum:allNum,
                        childLength:childLength,
                        callback:callback
                    });
                    callback(nowNum,allNum);
                }            
                return false;
            }
        }    
    }
})();

})();

