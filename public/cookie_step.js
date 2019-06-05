const crypto = require('crypto');
const secret = 'niyidingjiebuchulai'; //密钥--可以随便写
const cookieTime = 50 * 1000;//cookie跳转时长设置

module.exports={
	cookieStep:cookieStep,
	translateCookie:translateCookie,
	sessionStep:sessionStep
}

function cookieStep(obj,res){
	let cookieSend = "" + obj.name + "~" + obj.password + "~" + new Date().getTime(); //保存cookie验证，防止跨站session失效
	let str = JSON.stringify(cookieSend); //明文
	let cipher = crypto.createCipher('aes192', secret);
	let enc = cipher.update(str, 'utf8', 'hex'); //编码方式从utf-8转为hex;
	enc += cipher.final('hex'); //编码方式从转为hex;
	
	res.cookie('pbl', enc, {
		path: '/',
		maxAge: cookieTime,
		signed: true,
		httpOnly: true
	});
	res.cookie('style', obj.name, {
		path: '/',
		maxAge: 24 * 3600 * 1000,
		signed: true,
		httpOnly: true
	});
}

function translateCookie(req){
	let ss = req.signedCookies.pbl;
	let decipher = crypto.createDecipher('aes192', secret);
	try {
		var dec = decipher.update(ss, 'hex', 'utf8'); //编码方式从hex转为utf-8;
		dec += decipher.final('utf8'); //编码方式从utf-8;
	} catch (e) {
		obj.style = -1; //cookie解析错误
		return obj;
	}
	let out = JSON.parse(dec).split('~'); //这是解密后的结果
	obj.name = out[0];
	obj.pass = out[1];
	
	if (new Date() - out[2] < cookieTime) {
		obj.style = 1; //cookie正常
		return obj;
	} else {
		obj.style = -2; //cookie超时
		return obj;
	}
}
	
	
	
function sessionStep(req){
	req.session.style = 1;
}
	
