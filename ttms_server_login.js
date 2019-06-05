const sql = require('./public/sql.js');
const {
	sql: sqlConfig,
	url: urlConfig
} = require('./public/system_config.js');
const pool = sql.createPool(sqlConfig);
//创建数据库连接池
const cookieStep = require('./public/cookie_step.js').cookieStep;
//加密下发cookie
const {
	send,
	server
} = require('./public/http.js');
//解析网络请求
server.listen(517);


server.post('/reg', async function(req, res) {
	let obj = req.obj;
	if (obj.name == undefined || obj.password == undefined || obj.name.length > 32 || obj.password.length > 32) {
		send(res, {
			"msg": "参数错误！",
			"style": -1
		})
	}

	let sqlString = sql.select(['user_name', 'user_password'], 'user',`user_name=${sql.escape(obj.name)}`);
	try {
		var selectRepeat = await sql.sever(pool, sqlString);
	} catch (err) {
		send({
			"msg": err,
			"style": -2
		});
	}
	if (selectRepeat.length == 0) {
		let sqlString = sql.insert('user', ['user_status', 'user_name', 'user_password', 'user_time'],
			[0, sql.escape(obj.name), sql.escape(obj.password), 'NOW()']);
		try {
			await sql.sever(pool, sqlString);
		} catch (err) {
			send({
				"msg": err,
				"style": -2
			});
		}
		cookieStep(obj, res);
		send(res, {
			"msg": "注册成功",
			"url": "需要跳转的url",
			"style": 1
		})
	} else {
		send(res, {
			"msg": "注册失败--用户名重复",
			"style": 0
		})
	}
});
//用户注册


server.post('/login', async function(req, res) {
	let obj = req.obj;
	if (obj.name == undefined || obj.password == undefined) {
		send(res, {
			"msg": "参数错误！",
			"style": -1
		})
	}

	let sqlString = sql.select(['user_name', 'user_password', 'user_status'], 'user',
		`user_name=${sql.escape(obj.name)} AND user_password=${sql.escape(obj.password)}`);
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send({
			"msg": err,
			"style": -2
		});
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "用户名或密码错误！",
			"style": 0
		})
	} else {
		cookieStep(obj, res);
		send(res, {
			"msg": "登录成功！",
			"url": "需要跳转的url",
			"style": 1
		})
	}
});
//系统登录




server.get('/step', async function(req, res) {
	let keepOnLine = req.signedCookies.style;
	if (keepOnLine == undefined || keepOnLine == 0) {
		send(res, {
			msg: "登录状态没有保持",
			style: 0
		});
	} else {
		let sqlString = sql.select(['user_name', 'user_password', 'user_status'], 'user',
			`user_name=${sql.escape(keepOnLine)}`);
		try {
			var selectAns = await sql.sever(pool, sqlString);
		} catch (err) {
			send({
				"msg": err,
				"style": -2
			});
		}
		if (selectAns.length == 1) {
			let obj = {
				name:selectAns[0].user_name,
				password:selectAns[0].user_password
			}
			cookieStep(obj, res);
			send(res, {
				"msg": "登录成功！",
				"url": "需要跳转的url",
				"style": 1
			})
		} else {
			send(res, {
				msg: "登录状态没有保持",
				style: 0
			});
		}
	}
})
//登录保持接口









// server.post('/reg', function(req, res) {
// 	var obj = {};
// 	var message = '';
// 	req.on('data', function(data) {
// 		message += data;
// 	})
// 	req.on('end', function() {
// 		obj = JSON.parse(message);
// 
// 		var sqlString = sql.select(['user_id'], 'user', "user_name=" + sql.escape(obj.name));
// 		sql.sever(pool, sqlString, selectEnd); //数据库用户名查重
// 
// 		function selectEnd(data) {
// 			if (data.length == 0) {
// 				var sqlString = sql.insert('user', ['user_status', 'user_name', 'user_password', 'user_time'], [0, sql.escape(
// 						obj.name),
// 					sql.escape(obj.password), 'NOW()'
// 				]);
// 				sql.sever(pool, sqlString, end); //数据库存入注册的用户
// 			} else {
// 				res.write(JSON.stringify({
// 					msg: "注册失败--用户名重复",
// 					style: 0
// 				}));
// 				res.end();
// 			}
// 		}
// 	})
// 
// 	function end(data) {
// 		cookieStep(obj, res);
// 		res.write(JSON.stringify({
// 			msg: "注册成功",
// 			url: "需要跳转的url",
// 			style: 1
// 		}));
// 		res.end();
// 	}
// })
// //请求--注册信息
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// server.post('/reg', function(req, res) {
// 	var obj = {};
// 	var message = '';
// 	req.on('data', function(data) {
// 		message += data;
// 	})
// 	req.on('end', function() {
// 		obj = JSON.parse(message);
// 
// 		var sqlString = sql.select(['user_id'], 'user', "user_name=" + sql.escape(obj.name));
// 		sql.sever(pool, sqlString, selectEnd); //数据库用户名查重
// 
// 		function selectEnd(data) {
// 			if (data.length == 0) {
// 				var sqlString = sql.insert('user', ['user_status', 'user_name', 'user_password', 'user_time'], [0, sql.escape(
// 						obj.name),
// 					sql.escape(obj.password), 'NOW()'
// 				]);
// 				sql.sever(pool, sqlString, end); //数据库存入注册的用户
// 			} else {
// 				res.write(JSON.stringify({
// 					msg: "注册失败--用户名重复",
// 					style: 0
// 				}));
// 				res.end();
// 			}
// 		}
// 	})
// 
// 	function end(data) {
// 		cookieStep(obj, res);
// 		res.write(JSON.stringify({
// 			msg: "注册成功",
// 			url: "需要跳转的url",
// 			style: 1
// 		}));
// 		res.end();
// 	}
// })
// //请求--注册信息
// 
// server.post('/login', function(req, res) {
// 	var obj = {};
// 	var message = '';
// 	req.on('data', function(data) {
// 		message += data;
// 	})
// 	req.on('end', function() {
// 		obj = JSON.parse(message);
// 		var sqlString = sql.select(['user_id'], 'user',
// 			"user_name=" + sql.escape(obj.name) +
// 			" and user_password=" + sql.escape(obj.password));
// 		sql.sever(pool, sqlString, end); //验证用户名和密码
// 	})
// 
// 	function end(data) {
// 		if (data.length == 1) {
// 			cookieStep(obj, res);
// 			res.write(JSON.stringify({
// 				msg: "登录成功！",
// 				url: "需要跳转的url",
// 				style: 1
// 			}));
// 			res.end();
// 
// 		} else {
// 			res.write(JSON.stringify({
// 				msg: "用户名或密码错误！",
// 				style: 0
// 			}));
// 			res.end();
// 		}
// 	}
// })
// //请求--登录
//
