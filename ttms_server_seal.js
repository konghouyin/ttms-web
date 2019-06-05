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
	server,
	sessionStart,
	exit,
	judge,
	path
} = require('./public/http.js'); //解析网络请求
server.listen(965);

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
	
	sqlString =sql.select(['plan_id', 'room_id', 'plan_startime', 'plan_money'], 'plan',
	 'play_id=' + sql.escape(obj.id)+' and Date(plan.plan_startime) between Date(NOW()) and Date(date_add(NOW(), interval 5 day))');
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
//查询某一个电影近5天的演出计划



