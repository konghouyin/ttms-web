const sql = require('./public/sql.js');
const {
	sql: sqlConfig,
	url: urlConfig
} = require('./public/system_config.js');
const pool = sql.createPool(sqlConfig);
//创建数据库连接池
const {
	cookieStep,
	translateCookie,
	sessionStep
} = require('./public/cookie_step.js');
//解析cookie，下发session
const {
	send,
	app,
	router,
	sessionStart,
	exit,
	judge,
	path
} = require('./public/http.js'); //解析网络请求
app.listen(612);

let server = router;
app.use('/ttmsFinance',server);


server.get('/salerAll', async function(req, res) {
	let sqlString = sql.select(["user_id","user_name", "user_tel", "user_time"], 'user','user_status=2');
	try {
		var selectRepeat = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res,{
			"msg": err,
			"style": -2
		});
	}

	send(res, {
		"msg": "查询成功",
		"data": selectRepeat,
		"style": 1
	})

});
//查询所有销售员信息

server.get('/financebyid', async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		id:{
			type:"int",
			length:32
		},
		start: {
			length: 20
		},
		end: {
			length: 20
		}
	}
	let judgeCtrl = judge(judgeOptions, obj);
	if (judgeCtrl.style == 0) {
		send(res, {
			"msg": judgeCtrl.message,
			"style": -1
		})
		return;
	}
	
	let sqlString = sql.select(['sale_id','ticket_id','sale_money','sale_status','sale_time'], 
	'sale','user_id='+sql.escape(obj.id)+' and sale_time BETWEEN '+sql.escape(obj.start)+' AND '+sql.escape(obj.end));
	try {
		var selectRepeat = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res,{
			"msg": err,
			"style": -2
		});
	}

	send(res, {
		"msg": "查询成功",
		"data": selectRepeat,
		"style": 1
	})

});
//根据id查看某一时间段销售记录



server.get('/financebyuser', async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		start: {
			length: 20
		},
		end: {
			length: 20
		}
	}
	let judgeCtrl = judge(judgeOptions, obj);
	if (judgeCtrl.style == 0) {
		send(res, {
			"msg": judgeCtrl.message,
			"style": -1
		})
		return;
	}
	
	let sqlString = sql.select(['sale_id','ticket_id','sale_money','sale_status','sale_time'], 
	'sale,user','sale.user_id=user.user_id and user.user_status=4 and sale_time BETWEEN '+sql.escape(obj.start)+' AND '+sql.escape(obj.end));
	try {
		var selectRepeat = await sql.sever(pool, sqlString);
	} catch (err) {
		send({
			"msg": err,
			"style": -2
		});
	}

	send(res, {
		"msg": "查询成功",
		"data": selectRepeat,
		"style": 0
	})

});
//查看某一时间段个人用户的销售记录