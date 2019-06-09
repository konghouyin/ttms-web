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
app.listen(510);

let server = router;
app.use('/ttmsOperation',server);

server.get('/new', async function(req, res) {
	var obj = ranslateCookie(req);
	if (obj.style == 1) {
		let sqlString = sql.select(['user_name', 'user_password', 'user_status'], 'user',
			`user_name=${sql.escape(obj.name)} AND user_password=${sql.escape(obj.password)}`);
		try {
			var selectAns = await sql.sever(pool, sqlString);
		} catch (err) {
			send(res, {
				"msg": err,
				"style": -2
			});
			return;
		}
		if (selectAns.length == 1) {
			sessionStep(req); //合法登录下发session
			send(res, {
				"msg": "session已下发，登录状态安全",
				"name": obj.name,
				"style": 1
			})
		} else {
			send(res, {
				"msg": "数据库查询异常",
				"style": -10
			})
		}
	} else if (obj.style == -1) {
		send(res, {
			msg: "cookie解析错误",
			style: 0
		})
	} else if (obj.style == -2) {
		send(res, {
			msg: "cookie解析超时",
			style: -1
		})
	} else {
		send(res, {
			msg: "cookie解析style异常",
			style: -10
		})
	}
})
//跳转登录验证


server.get('/query', async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		url: {
			length: 500
		}
	}
	let judgeCtrl = judge(judgeOptions, obj);
	if (judgeCtrl.style == 0) {
		send(res, {
			"msg": judgeCtrl.message,
			"style": -1
		})
	} else {
		let pathCtrl = await path("http://localhost:798/index", {
			url: obj.url
		});
		if (pathCtrl.style == 1) {
			let back = JSON.parse(pathCtrl.message);
			send(res, {
				"msg": "解析成功！",
				"data": back.index.base,
				"style": 1
			})
		} else {
			send(res, {
				"msg": pathCtrl.message,
				"style": 0
			})
		}
	}
})
//通过豆瓣url解析主要信息




server.post('/playAdd', async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		name: {
			length: 64
		},
		director: {
			length: 32
		},
		actor: {
			length: 128
		},
		type: {
			length: 32
		},
		timelong: {
			type: "int",
			length: 32
		},
		country: {
			length: 32
		},
		language: {
			length: 32
		},
		status: {
			type: "only",
			main: ["已上映", "即将上映", "已下线"],
			length: 32
		},
		pic: {
			length: 200
		},
		link: {
			length: 200
		},
		url: {
			length: 200
		}
	}
	let judgeCtrl = judge(judgeOptions, obj);
	if (judgeCtrl.style == 0) {
		send(res, {
			"msg": judgeCtrl.message,
			"style": -1
		})
	} else {
		let waring = "null";
		obj.main = "";
		if (obj.url != "") {
			let pathCtrl = await path("http://localhost:798/index", {
				url: obj.url
			});
			if (pathCtrl.style == 1) {
				let ranges = [
					'\ud83c[\udf00-\udfff]',
					'\ud83d[\udc00-\ude4f]',
					'\ud83d[\ude80-\udeff]'
				];
				obj.main = pathCtrl.message.replace(new RegExp(ranges.join('|'), 'g'), '');
			} else {
				waring = "电影详情页爬取失败，失败原因：" + pathCtrl.message;
			}
		} else {
			waring = "没有爬取电影详细数据";
		}
		let sqlString = sql.insert('play', ['play_name', 'play_director', 'play_performer', 'play_type', 'play_length',
				'play_country', 'play_language', 'play_status', 'play_pic', 'play_message', 'play_link', 'play_path'
			],
			[sql.escape(obj.name), sql.escape(obj.director), sql.escape(obj.actor), sql.escape(obj.type), sql.escape(obj.timelong),
				sql.escape(obj.country), sql.escape(obj.language), sql.escape(obj.status), sql.escape(obj.pic), sql.escape(obj.main),
				sql.escape(obj.link), sql.escape(obj.url)
			]);
		try {
			var insertAns = await sql.sever(pool, sqlString);
		} catch (err) {
			send(res, {
				"msg": err,
				"style": -2
			});
			return;
		}
		send(res, {
			"msg": "电影信息添加成功！",
			"waring": waring,
			"style": 1
		});
	}
})
//添加剧目


server.get("/playAll", async function(req, res) {
	let sqlString = sql.select(['play_id', 'play_name', 'play_director', 'play_performer', 'play_type', 'play_length',
		'play_country', 'play_language', 'play_status', 'play_pic', 'play_link', 'play_path'
	], 'play', 'play_status<>-1') + ' ORDER BY play_id DESC';
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
//查询全部剧目


server.get("/playMain", async function(req, res) {
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
	let sqlString = sql.select(['play_id', 'play_name', 'play_director', 'play_performer', 'play_type', 'play_length',
		'play_country', 'play_language', 'play_status', 'play_pic', 'play_link', 'play_message', 'play_path'
	], 'play', 'play_status<>-1 and play_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length == 1) {
		send(res, {
			"msg": "查询成功！",
			"data": selectAns[0],
			"style": 1
		});
	} else {
		send(res, {
			"msg": "没有查询到该id对应的电影！",
			"style": 0
		});
	}
})
//查询具体剧目


server.post("/playDel", async function(req, res) {
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
	let sqlStringSelect = sql.select(['play_path'], 'play', 'play_status<>-1 and play_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "没有查询到要删除的id",
			"style": 0
		});
		return;
	}
	//唯一性id
	
	
	sqlStringSelect = sql.select(['plan_id'], 'plan', 'play_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 0) {
		send(res, {
			"msg": "已经安排过plan,无法删除",
			"style": 0
		});
		return;
	}
	//删除驳回，plan有数据

	let sqlString = sql.update('play', ['play_status'], ["-1"], 'play_id=' + sql.escape(obj.id));
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
		"msg": "删除成功！",
		"style": 1
	});
})
//删除剧目


server.post("/playEdit", async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		id: {
			type: "int",
			length: 32
		},
		name: {
			length: 64
		},
		director: {
			length: 32
		},
		actor: {
			length: 128
		},
		type: {
			length: 32
		},
		timelong: {
			type: "int",
			length: 32
		},
		country: {
			length: 32
		},
		language: {
			length: 32
		},
		status: {
			type: "only",
			main: ["已上映", "即将上映", "已下线"],
			length: 32
		},
		pic: {
			length: 200
		},
		link: {
			length: 200
		},
		url: {
			length: 200
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
	let sqlStringSelect = sql.select(['play_path'], 'play', 'play_status<>-1 and play_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "没有查询到要修改的id",
			"style": 0
		});
		return;
	}
	let waring = "null";
	obj.main = "";
	if (obj.url != "") {
		let pathCtrl = await path("http://localhost:798/index", {
			url: obj.url
		});
		if (pathCtrl.style == 1) {
			let ranges = [
				'\ud83c[\udf00-\udfff]',
				'\ud83d[\udc00-\ude4f]',
				'\ud83d[\ude80-\udeff]'
			];
			obj.main = pathCtrl.message.replace(new RegExp(ranges.join('|'), 'g'), '');
		} else {
			waring = "电影详情页爬取失败，失败原因：" + pathCtrl.message;
		}
	} else {
		waring = "没有爬取电影详细数据";
	}
	let sqlString = sql.update('play', ['play_name', 'play_director', 'play_performer', 'play_type', 'play_length',
			'play_country', 'play_language', 'play_status', 'play_pic', 'play_message', 'play_link', 'play_path'
		],
		[sql.escape(obj.name), sql.escape(obj.director), sql.escape(obj.actor), sql.escape(obj.type), sql.escape(obj.timelong),
			sql.escape(obj.country), sql.escape(obj.language), sql.escape(obj.status), sql.escape(obj.pic), sql.escape(obj.main),
			sql.escape(obj.link), sql.escape(obj.url)
		], 'play_id=' + sql.escape(obj.id));
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
		"msg": "编辑成功！",
		"waring": waring,
		"style": 1
	});
})
//编辑剧目


server.post("/roomAdd", async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		name: {
			length: 64
		},
		row: {
			type: "int",
			length: 32
		},
		col: {
			type: "int",
			length: 32
		},
		seat: {
			type: "Array",
			length: 1000000
		},
		status: {
			type: 'only',
			main: ["0", "1"],
			length: 10
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
	let connect = await sql.handler(pool);
	let sqlStringRoom = sql.insert('room', ['room_name', 'room_row', 'room_col', 'room_status'],
		[sql.escape(obj.name), sql.escape(obj.row), sql.escape(obj.col), sql.escape(obj.status)]);
	try {
		let message = await sql.stepsql(connect, sqlStringRoom);
		let roomId = message.insertId;
		for (let i = 0; i < obj.seat.length; i++) {
			let sqlString = sql.insert('seat', ['room_id', 'seat_row', 'seat_col', 'seat_status'],
				[sql.escape(roomId), sql.escape(obj.seat[i].row), sql.escape(obj.seat[i].col), sql.escape(obj.seat[i].status)]);
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
		"msg": "添加成功",
		"style": 1
	});
})
//添加演出厅


server.get("/roomAll", async function(req, res) {
	let sqlString = sql.select(['room_id', 'room_name', 'room_row', 'room_col', 'room_status'], 'room',
			'room_status<>-1') +
		' ORDER BY room_id';
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
//查询全部演出厅


server.get("/roomMain", async function(req, res) {
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
	let sqlStringSelect = sql.select(['room_id'], 'room', 'room_status<>-1 and room_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "没有查询到要该id对应的演出厅",
			"style": 0
		});
		return;
	}

	let sqlString = sql.select(['seat_id','seat_row', 'seat_col', 'seat_status'], 'seat', 'seat_status<>-2 and room_id=' + sql.escape(
		obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlString);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length == 0) {
		send(res, {
			"msg": "没有查询到该id对应的演出厅座位！",
			"style": 0
		});
	} else {
		send(res, {
			"msg": "查询成功！",
			"data": selectAns,
			"style": 1
		});
	}
})
//查询演出厅座位


server.post("/roomDel", async function(req, res) {
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
	let sqlStringSelect = sql.select(['room_id'], 'room', 'room_status<>-1 and room_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "没有查询到要删除的id",
			"style": 0
		});
		return;
	}
	
	sqlStringSelect = sql.select(['plan_id'], 'plan', 'room_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 0) {
		send(res, {
			"msg": "已经安排过plan,无法删除",
			"style": 0
		});
		return;
	}
	//删除驳回，plan有数据

	let connect = await sql.handler(pool);
	try {
		let sqlString = sql.update('room', ['room_status'], ['-1'], 'room_id=' + sql.escape(obj.id));
		await sql.stepsql(connect, sqlString);
		sqlString = sql.update('seat', ["seat_status"], ["-1"], "room_id=" + sql.escape(obj.id));
		await sql.stepsql(connect, sqlString);
		await connect.commit()
	} catch (err) {
		console.log(err);
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
		"msg": "删除成功！",
		"style": 1
	});
})
//删除演出厅





server.post("/roomEdit", async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		name: {
			length: 64
		},
		status: {
			type: 'only',
			main: ["0", "1"],
			length: 10
		},
		id: {
			type: 'int',
			length: 10
		},
		change: {
			type: 'only',
			main: ["0", "1"],
			length: 10
		},
		//该字段表示是否修改过座位表
	}
	let judgeCtrl = judge(judgeOptions, obj);
	if (judgeCtrl.style == 0) {
		send(res, {
			"msg": judgeCtrl.message,
			"style": -1
		})
		return;
	}
	if (obj.change == 1) {
		let seatOption = {
			seat: {
				type: "Array",
				length: 1000000
			},
			row: {
				type: "int",
				length: 32
			},
			col: {
				type: "int",
				length: 32
			}
		}
		let judgeCtrl = judge(seatOption, obj);
		if (judgeCtrl.style == 0) {
			send(res, {
				"msg": judgeCtrl.message,
				"style": -1
			})
			return;
		}
	}

	let sqlStringSelect = sql.select(['room_id'], 'room', 'room_status<>-1 and room_id=' + sql.escape(obj.id));
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns.length != 1) {
		send(res, {
			"msg": "没有查询到要修改的id演出厅",
			"style": 0
		});
		return;
	}


	let connect = await sql.handler(pool);
	try {
		if (obj.change == 1) {
			let sqlStringRoom = sql.update('room', ["room_name", "room_row", "room_col", "room_status"],
				[sql.escape(obj.name), sql.escape(obj.row), sql.escape(obj.col), sql.escape(obj.status)],
				"room_id=" + sql.escape(obj.id));
			await sql.stepsql(connect, sqlStringRoom);

			let sqlString = sql.update('seat', ["seat_status"], ["-2"], "room_id=" + sql.escape(obj.id));
			await sql.stepsql(connect, sqlString);

			for (let i = 0; i < obj.seat.length; i++) {
				let sqlString = sql.insert('seat', ['room_id', 'seat_row', 'seat_col', 'seat_status'],
					[sql.escape(obj.id), sql.escape(obj.seat[i].row), sql.escape(obj.seat[i].col), sql.escape(obj.seat[i].status)]
				);
				await sql.stepsql(connect, sqlString);
			}
		} else {

			let sqlStringRoom = sql.update('room', ["room_name", "room_status"],
				[sql.escape(obj.name), sql.escape(obj.status)],
				"room_id=" + sql.escape(obj.id));

			await sql.stepsql(connect, sqlStringRoom);
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
		"msg": "编辑成功！",
		"style": 1
	});
})
//编辑剧目

server.post("/planAdd", async function(req, res) {
	let obj = req.obj;
	let judgeOptions = {
		plan: {
			type: "Array",
			length: 1000000
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
	//参数格式正确性

	let roomArr = [];
	let playArr = [];
	for (let index = 0; index < obj.plan.length; index++) {
		let child = obj.plan[index];
		if (child.room == undefined) {
			send(res, {
				"msg": "list[" + index + "]没有room属性",
				"style": -1
			});
			return;
		}
		if (child.play == undefined) {
			send(res, {
				"msg": "list[" + index + "]没有play属性",
				"style": -1
			});
			return;
		}
		if (child.money == undefined) {
			send(res, {
				"msg": "list[" + index + "]没有money属性",
				"style": -1
			});
			return;
		}
		if (child.language == undefined) {
			send(res, {
				"msg": "list[" + index + "]没有language属性",
				"style": -1
			});
			return;
		}
		if (child.startime == undefined) {
			send(res, {
				"msg": "list[" + index + "]没有startime属性",
				"style": -1
			});
			return;
		}
		if(new Date(child.startime)<new Date() ){
			send(res, {
				"msg": "list[" + index + "]已早于当前时间",
				"style": -1
			});
			return;
		}
		
		roomArr.push(child.room);
		playArr.push(child.play);
	}
	
	roomArr = [...new Set(roomArr)];
	playArr = [...new Set(playArr)]; 
	
	roomStr = 'room_id=' + roomArr.join(' or room_id=');
	playStr = 'play_id=' + playArr.join(' or play_id=');
	//拼接校验字符串


	let sqlStringSelect = sql.select(['count(*)'], 'room', 'room_status=1 and (' + roomStr + ')');
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns[0]['count(*)'] != roomArr.length) {
		send(res, {
			"msg": "演出厅校验错误！",
			"style": 0
		});
		return;
	}
	//演出厅参数合法性

	sqlStringSelect = sql.select(['count(*)'], 'play', 'play_status="已上映" and (' + playStr + ')');
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	if (selectAns[0]['count(*)'] != playArr.length) {
		send(res, {
			"msg": "演出剧目校验错误！",
			"style": 0
		});
		return;
	}
	//演出剧目参数合法性
	//票价校验使用数据库校验

	let connect = await sql.handler(pool);
	try {
		for (let i = 0; i < obj.plan.length; i++) {
			let each = obj.plan[i];
			let sqlString = sql.insert('plan', ['room_id', 'play_id', 'plan_language','plan_startime', 'plan_money'],
				[sql.escape(each.room), sql.escape(each.play), sql.escape(each.language), sql.escape(each.startime),
					sql.escape(each.money)
				]);
			let planInsert = await sql.stepsql(connect, sqlString);
			let planID = planInsert.insertId;
			sqlString = sql.select(['seat_id'], 'seat', 'seat_status=1 and room_id=' + sql.escape(each.room));
			let seatList = await sql.stepsql(connect, sqlString);

			for (let j = 0; j < seatList.length; j++) {
				let sqlString = sql.insert('ticket', ['plan_id', 'seat_id', 'ticket_status'],
					[sql.escape(planID), sql.escape(seatList[j].seat_id), '0']);
				await sql.stepsql(connect, sqlString);
			}
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
		"msg": "演出计划添加成功！",
		"style": 1
	});

})

server.get('/planGet',async function(req,res){
	let obj = req.obj;
	let judgeOptions = {
		time :{
			length: 1000000
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
	//参数格式正确性
	
	sqlStringSelect = sql.select(['plan.plan_id','plan.room_id','room.room_name','plan.play_id','play.play_name','play.play_length','plan.plan_startime','plan.plan_money'], 'plan,play,room', 'plan.room_id=room.room_id and plan.play_id=play.play_id and Date(plan.plan_startime) = Date('+sql.escape(obj.time)+')');
	try {
		var selectAns = await sql.sever(pool, sqlStringSelect);
	} catch (err) {
		send(res, {
			"msg": err,
			"style": -2
		});
		return;
	}
	
	send(res, {
		"msg": "查询成功！",
		"data":selectAns,
		"style": 1
	});
	
})




// let connect = await sql.handler(pool);
// try {
// 
// 	await sql.stepsql(connect, sqlStringRoom);
// 
// 
// 	await connect.commit()
// } catch (err) {
// 	await connect.rollback()
// 	send(res, {
// 		"msg": err,
// 		"style": -2
// 	});
// 	return;
// } finally {
// 	connect.release()
// }
