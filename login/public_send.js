function check(x,y){
	if(document.getElementById(x).value.length<=y){
		document.getElementById(x).nextElementSibling.style.display="block";
		setTimeout(function(){ document.getElementById(x).nextElementSibling.style.display="none"; }, 3000);
	}
}
function check1(x){
		document.getElementById(x).nextElementSibling.style.display="none";
}

function send1(){
	var x=document.getElementById("login_user");
	var y=document.getElementById("login_password");
	if(x.value.length!=0&&y.value.length>=6){
		Ajax({
			url:"https://www.konghouy.cn/ttmsLogin/login",
			type:"post",
			data:{name:x.value,password:hex_md5(y.value)},
			 async: true,   //是否异步
			success: function (responseText) {
			    if(responseText.style==1){
					window.location.href=responseText.url;
				}
				else{
					alert("用户名或密码错误！");
				}
			},
			fail: function (err) {
			    alert("出现错误");
			}
		})
	}
}
	
function send2(){
	var a=document.getElementById("register_user");
	var b=document.getElementById("register_password1");
	var c=document.getElementById("register_password2");
	
	if(b.value!=c.value){
		alert("两次密码不一致");
	}else{
		Ajax({
			url:"https://www.konghouy.cn/ttmsLogin/reg",
			type:"post",
			data:{name:a.value,password:hex_md5(b.value)},
			 async: true,   //是否异步
			success: function (responseText) {
			    if(responseText.style==1){
					alert("注册成功-请登录");
				}
				else{
					alert("注册失败--用户名重复");
				}
			},
			fail: function (err) {
			    alert("出现错误");
			}
		})
	}
}
	
