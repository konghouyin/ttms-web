const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const request = require("request"); //发送网路请求


const server = express(); //使用express框架
const router = express.Router();//创建路由

server.use(cookieParser('sadssdasdasdasd'));
//为cookie添加签名，防篡改-中间件

const arr = [];
for (let i = 0; i < 10000; i++) {
	arr.push(Math.random() * 9999999 + "");
}
//生成加密数组作为秘钥
server.use(cookieSession({
	name: 'sess', //session名称
	keys: arr, //手动设置session密钥.这个秘钥必须是字符串数组
	maxAge: 5 * 60 * 1000 //手动设置session过期时间，单位为毫秒

}));
//设置session-中间件


server.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", true); //带cookies7     
	res.header("Content-Type", "application/json;charset=utf-8"); //解决中文乱码
	next();
});
//处理跨域-中间件



server.post('*', function(req, res, next) {
	let message = '';
	req.on('data', function(data) {
		message += data;
	})
	req.on('end', function() {
		try {
			req.obj = JSON.parse(message);
		} catch (e) {
			req.obj = {};
		}
		next();
	});
});
//post请求数据解析-中间件

server.get('*', function(req, res, next) {
	req.obj = req.query;
	next();

});
//get请求数据解析-中间件


server.all(function(req, res, next) {
	req.session._garbage = Date();
	next();
});

//session时间更新

function sessionStart() {
	server.all('*', function(req, res, next) {
		if (req.session.style != 1) {
			res.write(JSON.stringify({
				msg: "sesson失效",
				url: "跳转登录页",
				style: -200
			}));
			res.end();
		} else {
			next();
		}
	})
}
//session安全验证


function exit() {
	server.all('/exit', function(req, res) {
		req.session.style = 0;
		res.cookie('style', 0, {
			path: '/',
			maxAge: 1,
			signed: true,
			httpOnly: true
		});

		res.write(JSON.stringify({
			msg: "退出登录",
			url: "跳转登录页",
			style: 1
		}));
		res.end();
	})
}
//session安全退出



function send(res, obj) {
	res.write(JSON.stringify(obj));
	res.end();
}
//发送请求


function judge(judge, obj) {
	for (each in judge) {
		if (obj[each] == undefined) {
			return {
				style: 0,
				message: each+"参数缺失"
			};
		}
		
		if (judge[each].length <= obj[each].length) {
			return {
				style: 0,
				message: each + "长度不符合要求"
			};
		}
		
		if(judge[each].type && judge[each].type.toLowerCase() == "array"){
			if (!(obj[each] instanceof Array)){
				return {
					style: 0,
					message: each + "(Array)参数格式不对"
				};
			}
		}
		
		if(judge[each].type && judge[each].type.toLowerCase() == "object"){
			if (!(obj[each] instanceof Object)){
				return {
					style: 0,
					message: each + "(Object)参数格式不对"
				};
			}
		}
		

		if (judge[each].type && judge[each].type.toLowerCase()  == "int") {
			let int = Number.parseInt(obj[each]);
			if (isNaN(int)) {
				return {
					style: 0,
					message: each + "(Int)参数格式不对"
				};
			} else {
				obj[each] = int;
			}
		}

		if (judge[each].type && judge[each].type.toLowerCase()  == "float") {
			let float = Number.parseFloat(obj[each]);
			if (isNaN(float)) {
				return {
					style: 0,
					message: each + "(Float)参数格式不对"
				};
			} else {
				obj[each] = float;
			}
		}

		if (judge[each].type && judge[each].type.toLowerCase() == "only") {
			let flag = 0;
			for (let i = 0; i < judge[each].main.length; i++) {
				if (judge[each].main[i] == obj[each]) {
					flag = 1;
				}
			}
			if (flag == 0) {
				return {
					style: 0,
					message: each + "(only)参数内容不对"
				};
			}

		}

	}
	return {
		style: 1
	};
}
//审核参数正确性



function path(add, qs) {
	return new Promise(function(resolve, reject) {
		try {
			let options = {
				method: 'GET',
				url: add,
				qs: qs,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			request(options, function(error, response, body) {
				if (error) {
					resolve({
						message: "内网连通失败",
						style: 0
					})
				} else {
					if(body[0]==="0"){
						resolve({
							message: body.substring(1),
							style: 0
						})
					}else{
						resolve({
							message: body,
							style: 1
						});
					}
					
				}
			});
		} catch (e) {
			resolve({
				message: "内网连通失败",
				style: 0
			});
		}
	})
}
//内网爬虫

module.exports = {
	send: send,
	app: server,
	router:router,
	sessionStart: sessionStart,
	exit: exit,
	judge: judge,
	path: path
}
