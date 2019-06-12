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
app.listen(965);

let server = router;
app.use('/ttmsSale',server);

server.get('/playNear',async function(req,res){
	let sqlString =`SELECT distinct play.play_id, play.play_name, play.play_director, play.play_performer,
	 play.play_type, play.play_length,play.play_country, play.play_language, play.play_status, play.play_pic,
	  play.play_link, play.play_path FROM play,plan WHERE Date(plan.plan_startime) between Date(NOW()) 
	  and Date(date_add(NOW(), interval 5 day)) and plan.play_id=play.play_id `;
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	send(res, {
		"msg": "查询成功！",
		"data": selectAns,
		"style": 1
	});
})
//查询近5日的电影信息



server.get('/planList',async function(req,res){
	let obj = req.obj;
	let judgeOptions = {
		id: {
			type: "int",
			length: 32
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
	//判断参数合法性
	let sqlString =sql.select(['play_id'], 'play', 'play_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if(selectAns.length!=1){
		send(res, {
			"msg": "没有查询到此电影！",
			"style": 0
		});
		return;
	}
	
	sqlString =sql.select(['plan.plan_id', 'plan.room_id', 'room.room_name','DAYOFWEEK(plan.plan_startime) AS data','plan.plan_startime', 'plan.plan_money','plan.plan_language'], 'plan,room',
	 'plan.room_id=room.room_id and plan.play_id=' + sql.escape(obj.id)+' and Date(plan.plan_startime) between Date(NOW()) and Date(date_add(NOW(), interval 5 day))');
	try {
		var selectAns = await sql.sever(pool, sqlString+' ORDER BY plan.plan_startime');
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	send(res, {
		"msg": "查询成功！",
		"data": selectAns,
		"style": 1
	});
	
})
//查询某一个电影近5天的演出计划


server.get('/ticketList',async function(req,res){
	let obj = req.obj;
	let judgeOptions = {
		id: {
			type: "int",
			length: 32
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
	//判断参数合法性
	let sqlString =sql.select(['plan_id'], 'plan', 'plan_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if(selectAns.length!=1){
		send(res, {
			"msg": "没有查询到电影的演出计划！",
			"style": 0
		});
		return;
	}
	
	sqlString = sql.select(['ticket_id', 'seat_id'], 'ticket','plan_id=' + sql.escape(obj.id));
	//查询所有票
	try {
		var selectAnsAll = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	
	
	sqlString =sql.select(['ticket_id', 'seat_id'], 'ticket','plan_id=' + sql.escape(obj.id)+
	' and (ticket_status=1 or (ticket_status=2 and ticket_time > date_sub(NOW(),interval 10 minute)))');
	//查询已卖出的票
	try {
		var selectAnsSale = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	
	send(res, {
		"msg": "查询成功！",
		"dataAll": selectAnsAll,
		"dataSale":selectAnsSale,
		"style": 1
	});
	
})
//查询某一个演出计划的演出票


server.post('/sale',async function(req,res){
	let obj = req.obj;
	let judgeOptions = {
		ticket: {
			type: "Array",
			length: 5000
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
	//参数为数组的校验
	let ticketArr = [];
	for (let index = 0; index < obj.ticket.length; index++) {
		let child = obj.ticket[index];
		let int = Number.parseInt(child);
		if (isNaN(int)) {
			send(res, {
				"msg": "数组第"+index+"元素不是Int类型",
				"style": -1
			})
			return;
		}
		ticketArr.push(child);
	}
	ticketStr = 'ticket_id=' + ticketArr.join(' or ticket_id=');
	//参数为整数校验
	
	let sqlStringSelect = sql.select(['count(*)'], 'ticket,plan', 
	'ticket.plan_id=plan.plan_id and plan.plan_startime > NOW() and (ticket_status=0 or (ticket_status=2 and ticket_time < date_sub(NOW(),interval 10 minute))) and (' + ticketStr + ')');
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns[0]['count(*)'] != ticketArr.length) {
		send(res, {
			"msg": "演出票校验错误！",
			"style": 0
		});
		return;
	}
	//演出厅参数合法性
	//校验问题：1.同一张票多次购买
	//2.购买已经售出的票
	//3.购买当前时间之前的票
	
	
	let connect = await sql.handler(pool);
	try {
		for(let i=0;i<ticketArr.length;i++){
			let sqlString =  sql.update('ticket', ['ticket_status'],['1'],'ticket_id='+sql.escape(ticketArr[i]));
			await sql.stepsql(connect, sqlString);
			
			sqlString =  sql.select( ['plan_money'],'ticket,plan','plan.plan_id=ticket.plan_id and ticket.ticket_id='+sql.escape(ticketArr[i]));
			var num = await sql.stepsql(connect, sqlString);
			
			sqlString =  sql.insert('sale', ['user_id','ticket_id','sale_money','sale_status'],['1',sql.escape(ticketArr[i]),num[0].plan_money,'1']);
			await sql.stepsql(connect, sqlString);
		}
		await connect.commit()
	} catch (err) {
		await connect.rollback()
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	} finally {
		connect.release()
	}
	
	send(res, {
		"msg": "购票成功！",
		"style": 1
	});
})
//购票



server.post('/order',async function(req,res){
	let obj = req.obj;
	let judgeOptions = {
		id:{
			type="int",
			length:32
		},
		ticket: {
			type: "Array",
			length: 5000
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
	//参数为数组的校验
	let ticketArr = [];
	for (let index = 0; index < obj.ticket.length; index++) {
		let child = obj.ticket[index];
		let int = Number.parseInt(child);
		if (isNaN(int)) {
			send(res, {
				"msg": "数组第"+index+"元素不是Int类型",
				"style": -1
			})
			return;
		}
		ticketArr.push(child);
	}
	ticketStr = 'ticket_id=' + ticketArr.join(' or ticket_id=');
	//参数为整数校验
	
	let sqlStringSelect = sql.select(['count(*)'], 'ticket,plan', 
	'ticket.plan_id=plan.plan_id and plan.plan_startime > NOW() and (ticket_status=0 or (ticket_status=2 and ticket_time < date_sub(NOW(),interval 10 minute))) and (' + ticketStr + ')');
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns[0]['count(*)'] != ticketArr.length) {
		send(res, {
			"msg": "演出票校验错误！",
			"style": 0
		});
		return;
	}
	//演出厅参数合法性
	//校验问题：1.同一张票多次购买
	//2.购买已经售出的票
	//3.购买当前时间之前的票
	
	
	let connect = await sql.handler(pool);
	try {
		for(let i=0;i<ticketArr.length;i++){
			let sqlString =  sql.update('ticket', ['ticket_status','ticket_time'],['2','NOW()'],'ticket_id='+sql.escape(ticketArr[i]));
			await sql.stepsql(connect, sqlString);			
		}
		
		
		let sqlStringSelect = sql.select(['plan_money'], 'ticket,plan', 'ticket.plan_id=plan.plan_id ticket_id='+sql.escape(ticketArr[0]));
		let money = await sql.stepsql(connect, sqlString);
		
		
		sqlString =  sql.insert('orderticket', ['user_id','orderTicket_money','orderTicket_history','orderTicket_time','orderTicket_status'],
		[sql.escape(obj.id),money*ticketArr.length,sql.escape(JSON.stringify(ticketArr)),'NOW()','0']);
		await sql.stepsql(connect, sqlString);
		
		await connect.commit()
	} catch (err) {
		await connect.rollback()
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	} finally {
		connect.release()
	}
	
	send(res, {
		"msg": "订票成功！",
		"style": 1
	});
})
//订票

//订票还需要生成订单!!!