var add = document.getElementById('add');
var add1 = document.getElementById('add1');
var bd = document.getElementById('bd');
var back = document.getElementById('back');
var oTab = document.getElementById('table1');
var oTab2 = document.getElementById('table2');
var name1 = document.getElementById('name');
var direcyor = document.getElementById('direcyor');
var type = document.getElementById('type');
var length = document.getElementById('length');
var country = document.getElementById('country');
var language = document.getElementById('language');
var actors = document.getElementById('actors')
var zt = document.getElementById('zt');
var zt1 = document.getElementById('zt1');
var ok = document.getElementById('ok');
var jiexi = document.getElementById('jiexi');
var URL = document.getElementById('URL');
var img1 = document.getElementById('img1');
var link = document.getElementById('link')
var arr1 = new Array();
var arrPlanJM = new Array();
var flag = 0;
var seatFlag = 0;
var change = 0;
var box1 = document.getElementById('box1');
var box2 = document.getElementById('box2');
var box3 = document.getElementById('box3');
var boxf1 = document.getElementById('box-f1');
var boxf2 = document.getElementById('box-f2');
var boxf3 = document.getElementById('box-f3');
var div1 = document.getElementById("bd");
var div2 = document.getElementById("bd1");
var row = document.getElementById('row');
var col = document.getElementById('col');
var seat = document.getElementById('seat');
var arrseat = new Array();
var checkSeat1 = document.getElementById('checkSeat1');
var checkSeat2 = document.getElementById('checkSeat2');
var roomname = document.getElementById('roomname');
var arrRoom = new Array();
var arrPlanRoom = new Array();
var boxJM = document.getElementById('box-jm');
var planRoom = document.getElementById('plan-room');
var planName = document.getElementById('p-name');
var planLong = document.getElementById('p-long');
var Plan = document.getElementById('plan-m');
var planPrice = document.getElementById('price');
var planStartTime = document.getElementById('plan-Start-Time');
var planEndTime = document.getElementById('plan-End-Time');
var planTimeFlag = 0;
var dayFlag = 0;
var day_1 = document.getElementById('day--1');
var day0 = document.getElementById('day-0');
var day1 = document.getElementById('day-1');
var day2 = document.getElementById('day-2');
var arrday = new Array(day_1, day0, day1, day2);
var arrplan = new Array();
var planLanguage = document.getElementById('plan-language');
var arrRoomBox = new Array();
var arrSearchPlan = new Array();
var planDate = new Date();
var planNameFlag = 0;
var arrPlanAdd = new Array();
var delFlag = 0;
window.onload = function() {

	oseat()
	add.onclick = function() {
		URL.value = null;
		name1.value = null;
		type.value = null;
		direcyor.value = null;
		length.value = null;
		language.value = null;
		country.value = null;
		actors.value = null;
		link.value = null;
		img1.value = null;
		document.getElementById('bd').style.display = "block";
		flag = 0;
	}

	add1.onclick = function() {
		roomname.value = '';
		row.value = 20;
		col.value = 30;
		oseat();
		document.getElementById('bd1').style.display = "block";
		seatFlag = 0;
	}

	back.onclick = function() {
		document.getElementById('bd').style.display = "none";
		flag = 0;
	}

	back1.onclick = function() {
		document.getElementById('bd1').style.display = "none";
		seatFlag = 0;
	}

	jiexi.onclick = function() {
		Ajax({
			url: "https://www.konghouy.cn/ttmsOperation/query",
			type: "GET",
			data: {
				url: URL.value
			},
			async: true,
			success: function(responseText) {

				if (responseText.style == 1) {
					name1.value = responseText.data.name.split(' ')[0]
					direcyor.value = responseText.data.director[0].name
					type.value = responseText.data.type
					length.value = responseText.data.runtime
					country.value = responseText.data.place
					language.value = responseText.data.language
					var i = 0
					var n = 10;
					var arr = [];
					if (responseText.data.actors.length < 10)
						n = responseText.data.actors.length
					for (i = 0; i < n; i++) {
						arr.push(responseText.data.actors[i].name);
					}
					actors.value = arr.join(" / ")
					img1.value = responseText.data.img
				} else {
					alert(responseText.msg);
				}
			},
			fail: function(err) {
				alert("解项URL出现错误");
			}
		})
	}
	getmessage();
	getRoom();
	ok.onclick = function() {
		if (name1.value == '' || length.value == '' || zt.value == 'all')
			alert("电影名/片长不能为空,状态不能为全部");
		else {
			var url1;
			var data1;
			if (flag == 0) {
				url1 = "https://www.konghouy.cn/ttmsOperation/playAdd",
					data1 = {
						name: name1.value,
						director: direcyor.value,
						actor: actors.value,
						type: type.value,
						timelong: length.value,
						country: country.value,
						language: language.value,
						status: zt.value,
						pic: img1.value,
						link: link.value,
						url: URL.value
					}
			} else {
				url1 = "https://www.konghouy.cn/ttmsOperation/playEdit",
					data1 = {
						id: flag,
						name: name1.value,
						director: direcyor.value,
						actor: actors.value,
						type: type.value,
						timelong: length.value,
						country: country.value,
						language: language.value,
						status: zt.value,
						pic: img1.value,
						link: link.value,
						url: URL.value
					}
				flag = 0;
			}
			Ajax({
				url: url1,
				type: "POST",
				data: data1,
				async: true,
				success: function(responseText) {
					if (responseText.style == 1) {
						oTab.removeChild(oTab.tBodies[0])
						oTab.innerHTML =
							`
				<tbody id="t1"><tr class="kt">
					<th>影片id</th>
					<th>名称</th>
					<th>导演</th>
					<th>类型</th>
					<th>片长</th>
					<th>语言</th>
					<th>状态</th>
					<th>编辑</th>
				</tr>
				</tbody>`
						getmessage()
						URL.value = null;
						name1.value = null;
						type.value = null;
						direcyor.value = null;
						length.value = null;
						language.value = null;
						country.value = null;
						actors.value = null;
						link.value = null;
						img1.value = null;
					} else {
						alert(responseText.msg)
					}
				},
				fail: function(err) {
					alert("数据传输失败")
				}
			})
		}
	}
	move(div1, 160, 300, box1);
	move(div2, 120, 270, box2);
}

function move(qwq, a, b, bqwq) {
	var div = qwq;
	var dragFlag = false;
	var x, y, marginTop, marginLeft;

	div.onmousedown = function(e) {
		e = e || window.event;
		x = e.clientX;
		y = e.clientY;
		marginTop = Number.parseInt(div.style.marginTop) || a;
		marginLeft = Number.parseInt(div.style.marginLeft) || b;
		if (e.path[0].tagName != "INPUT") {
			dragFlag = true;
		}
	};

	bqwq.onmousemove = function(e) {
		if (dragFlag) {
			e = e || window.event;
			div.style.marginLeft = e.clientX - x + marginLeft + "px";
			div.style.marginTop = e.clientY - y + marginTop + "px";
		}
	};

	bqwq.onmouseup = function(e) {
		dragFlag = false;
	};

}

function del(id) {
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/playDel",
		type: "POST",
		data: {
			id: id
		},
		async: true,
		success: function(responseText) {
			if (responseText.style == 1) {
				oTab.removeChild(oTab.tBodies[0])
				oTab.innerHTML =
					`
				<tbody id="t1"><tr class="kt">
					<th>影片id</th>
					<th>名称</th>
					<th>导演</th>
					<th>类型</th>
					<th>片长</th>
					<th>语言</th>
					<th>状态</th>
					<th>编辑</th>
				</tr>
			</tbody>`
				getmessage()
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("删除失败")
		}
	})
}

function bianji(id) {
	document.getElementById('bd').style.display = "block";
	URL.value = arr1[id].path;
	name1.value = arr1[id].name;
	type.value = arr1[id].type;
	direcyor.value = arr1[id].director;
	length.value = arr1[id].length;
	language.value = arr1[id].language;
	country.value = arr1[id].country;
	actors.value = arr1[id].performer;
	link.value = arr1[id].link;
	img1.value = arr1[id].pic;
	zt.value = arr1[id].status;
	flag = id;
}

function getmessage() {
	arr1 = [];
	arrPlanJM = [];
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/playAll",
		type: "GET",
		data: null,
		async: true,
		success: function(responseText) {
			if (responseText.style == 1) {
				var n = responseText.data.length;
				var i = 0;
				for (i = 0; i < n; i++) {
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_director;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_type;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_length + 'min';
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_language;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].play_status;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td')
					oTd.innerHTML = '<a onclick="del(' + responseText.data[i].play_id +
						')">删除</a>/<a onclick="bianji(' + responseText.data[i].play_id + ')">编辑</a>'
					oTr.appendChild(oTd)
					var datas = {
						id: responseText.data[i].play_id,
						name: responseText.data[i].play_name,
						director: responseText.data[i].play_director,
						country: responseText.data[i].play_country,
						language: responseText.data[i].play_language,
						length: responseText.data[i].play_length,
						link: responseText.data[i].play_link,
						performer: responseText.data[i].play_performer,
						pic: responseText.data[i].play_pic,
						status: responseText.data[i].play_status,
						type: responseText.data[i].play_type,
						path: responseText.data[i].play_path
					};
					arr1[responseText.data[i].play_id] = datas;
					arrPlanJM.push(datas);
					oTab.tBodies[0].appendChild(oTr);
				}
				planJM();
				if (n <= 8) {
					document.getElementById('sauto').style.height = (n + 1) * 51.18 + 'px';
				}
			} else {
				alert(responseText.msg)
			}
		},

		fail: function(err) {
			alert("数据请求失败")
		}
	})
}

function box(a, b, c, a1, b1, c1) {
	a.style.display = "block";
	b.style.display = "none";
	c.style.display = "none";
	a1.style.fontSize = "16px";
	b1.style.fontSize = "13.6px";
	c1.style.fontSize = "13.6px";
	a1.childNodes[1].style.display = "block";
	b1.childNodes[1].style.display = "none";
	c1.childNodes[1].style.display = "none";
}

function oseat() {
	if (seatFlag != 0) {
		change = 1;
	}
	arrseat = [];
	if (row.value <= 20 && col.value <= 30 && row.value > 0 && col.value > 0) {
		var pt = (421.82 - 21.091 * parseInt(row.value)) / 2
		if (pt < 0) {
			pt = 0;
		}
		var seatpic = ""
		seat.innerHTML = seatpic;
		seat.style.width = parseInt(col.value) * 22 + "px";
		seat.style.paddingTop = pt + "px";
		seat.style.paddingBottom = pt + "px";
		var x = 0
		var y = 0
		for (y = 0; y < row.value; y++) {
			for (x = 0; x < col.value; x++) {
				var obseat = {
					row: y + 1,
					col: x + 1,
					status: 1
				}
				arrseat.push(obseat);
				seatpic += '<img src="seat.png" name="seat.png" width="15px" height="13px" style="margin-left: 7px" onclick="deseat(' +
					arrseat.length + ',this)"/>'
			}
		}
		seat.innerHTML += seatpic;
	} else {
		alert("行数列数必须为正整数且行数小于20，列数小于30")
	}
}

function deseat(xy, seatImg) {
	xy = xy - 1;
	if (checkSeat1.checked) {
		if (seatImg.name == "seat.png") {
			seatImg.src = "stop.png";
			seatImg.name = "stop.png";
			arrseat[xy].status = 0;
			change = 1;
		} else {
			seatImg.src = "seat.png";
			seatImg.name = "seat.png";
			arrseat[xy].status = 1;
			change = 1;
		}
	}
	if (checkSeat2.checked) {
		if (seatImg.name == "seat.png") {
			seatImg.src = "none.png";
			seatImg.name = "none.png";
			arrseat[xy].status = -1;
			change = 1;
		} else {
			seatImg.src = "seat.png";
			seatImg.name = "seat.png";
			arrseat[xy].status = 1;
			change = 1;
		}
	}
}

function submission() {
	if (roomname.value == '' || zt1.value == 'all') {
		alert("影厅名称和状态不能为空");
	} else {
		if (seatFlag == 0) {
			var seatURL = "https://www.konghouy.cn/ttmsOperation/roomAdd";
			var seatData = {
				name: roomname.value,
				row: row.value,
				col: col.value,
				seat: arrseat,
				status: zt1.value
			}
		} else {
			var seatURL = "https://www.konghouy.cn/ttmsOperation/roomEdit";
			if (change) {
				var seatData = {
					id: seatFlag,
					name: roomname.value,
					row: row.value,
					col: col.value,
					seat: arrseat,
					status: zt1.value,
					change: 1
				}
			} else {
				var seatData = {
					id: seatFlag,
					name: roomname.value,
					status: zt1.value,
					change: 0
				}
			}
		}
		Ajax({
			url: seatURL,
			type: "post",
			data: seatData,
			async: true, //是否异步
			success: function(responseText) {
				change = 0;
				if (responseText.style == 1) {
					getRoom();
					roomname.value = '';
					row.value = 20;
					col.value = 30;
					oseat();
				} else {
					alert(responseText.msg);
				}
			},
			fail: function(err) {
				change = 0;
				alert("添加失败");
			}
		})
	}

}

function getRoom() {
	arrRoom = [];
	arrPlanRoom = [];
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/roomAll",
		type: "GET",
		data: null,
		async: true, //是否异步
		success: function(responseText) {
			if (responseText.style == 1) {
				oTab2.removeChild(oTab2.tBodies[0])
				oTab2.innerHTML =
					`
						<tbody id="t1"><tr class="kt">
							<th>影厅id</th>
							<th>名称</th>
							<th>行数</th>
							<th>列数</th>
							<th>状态</th>
							<th>编辑</th>
						</tr>
					</tbody>`
				var n = responseText.data.length;
				var i = 0;
				for (i = 0; i < n; i++) {
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].room_id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].room_name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].room_row;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].room_col;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					if (responseText.data[i].room_status == 1) {
						oTd.innerHTML = "启用";
					} else {
						oTd.innerHTML = "停用";
					}
					oTr.appendChild(oTd);
					var oTd = document.createElement('td')
					oTd.innerHTML = '<a onclick="seatDel(' + responseText.data[i].room_id + ')">删除</a>/<a onclick="seatBJ(' +
						responseText.data[i].room_id + ')">编辑</a>'
					oTr.appendChild(oTd)
					var datas = {
						id: responseText.data[i].room_id,
						name: responseText.data[i].room_name,
						row: responseText.data[i].room_row,
						col: responseText.data[i].room_col,
						status: responseText.data[i].room_status
					};
					arrRoom[responseText.data[i].room_id] = datas;
					arrPlanRoom.push(datas);
					oTab2.tBodies[0].appendChild(oTr);
					planYCT();
				}
				if (n <= 8) {
					document.getElementById('sauto1').style.height = (n + 1) * 51.18 + 'px';
				}
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("查询失败");
		}
	})
}

function seatBJ(roomID) {
	document.getElementById('bd1').style.display = "block";
	roomname.value = arrRoom[roomID].name;
	row.value = arrRoom[roomID].row;
	col.value = arrRoom[roomID].col;
	zt1.value = arrRoom[roomID].status;
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/roomMain",
		type: "GET",
		data: {
			id: roomID
		},
		async: true, //是否异步
		success: function(responseText) {
			if (responseText.style == 1) {
				arrseat = [];
				var pt = (421.82 - 21.091 * parseInt(row.value)) / 2
				if (pt < 0) {
					pt = 0;
				}
				var seatpic = ""
				seat.innerHTML = seatpic;
				seat.style.width = parseInt(col.value) * 22 + "px";
				seat.style.paddingTop = pt + "px";
				seat.style.paddingBottom = pt + "px";
				var m = 0
				for (m = 0; m < responseText.data.length; m++) {
					var obseat = {
						row: responseText.data[m].seat_row,
						col: responseText.data[m].seat_col,
						status: responseText.data[m].seat_status
					}
					arrseat.push(obseat);
					if (responseText.data[m].seat_status == 1) {
						var imgsrc = "seat.png"
					} else if (responseText.data[m].seat_status == 0) {
						var imgsrc = "stop.png"
					} else {
						var imgsrc = "none.png"
					}
					seatpic += '<img src=' + imgsrc + ' name="'+imgsrc+'" width="15px" height="13px" style="margin-left: 7px" onclick="deseat(' +
						arrseat.length + ',this)"/>'
				}
				seat.innerHTML += seatpic;
				seatFlag = roomID;
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("座位加载失败");
		}
	})
}

function seatDel(roomID) {
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/roomDel",
		type: "POST",
		data: {
			id: roomID
		},
		async: true, //是否异步
		success: function(responseText) {
			if (responseText.style == 1) {
				getRoom();
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("删除失败");
		},
	})
}

function planJM() {
	boxJM.innerHTML = '';
	for (var i = 0; i < arrPlanJM.length; i++) {
		if (arrPlanJM[i].status == "已上映") {
			boxJM.innerHTML += '<div class="box-jm1" onclick="pAdd(' + arrPlanJM[i].id + ')">' + arrPlanJM[i].name + '</div>'
		}
	}
}

function pAdd(JMid) {
	planName.innerHTML =  arr1[JMid].name ;
	planName.name = arr1[JMid].id;
	planNameFlag = arr1[JMid].id;
	planLong.innerHTML =  arr1[JMid].length + 'min';
	plan_language(JMid);
	planTimeFlag = arr1[JMid].length
}

function planYCT() {
	planRoom.innerHTML = '';
	planRoom.innerHTML += '<option value="all">全部</option>'
	for (var i = 0; i < arrPlanRoom.length; i++) {
		if (arrPlanRoom[i].status == 1) {
			planRoom.innerHTML += '<option value=' + arrPlanRoom[i].id + '>' + arrPlanRoom[i].name + '</option>'
		}
	}
	Plan.innerHTML = '';
	arrRoomBox = [];
	for (var i = 0; i < arrPlanRoom.length; i++) {
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');		
		if (arrPlanRoom[i].status == 1) {
			div1.innerHTML = '<div class="box-plan-name">' + arrPlanRoom[i].name + '</div>'
			div2.innerHTML = '<div id="Room-' + arrPlanRoom[i].id +'" class="box-plan-in"></div>'		
		} else {
			div1.innerHTML = '<div class="box-plan-name">' + arrPlanRoom[i].name + '(已停用)</div>'
			div2.innerHTML ='<div id="Room-' + arrPlanRoom[i].id +'" class="box-plan-in"></div>'
		}
		Plan.appendChild(div1);
		Plan.appendChild(div2);
		arrRoomBox.push(div2.childNodes[0]);
	}
}

function planTime() {
	var t = Number.parseInt(planStartTime.value.split(':')[0] * 60) + Number.parseInt(planStartTime.value.split(':')[1]) +
		Number.parseInt(planTimeFlag);
	var m = Number.parseInt(t / 60);
	var s = t - m * 60;
	if (m > 24) {
		m = m - 24;
	}
	if (s < 10) {
		s = '0' + s;
	}
	if (planStartTime.value) {
		planEndTime.innerHTML = '<div>' + m + ':' + s + '</div>'
	}
}

function planDay() {
	var Ptime = planDate.getFullYear() + '-' + (planDate.getMonth() + 1) + '-' + planDate.getDate();
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/planGet",
		type: "GET",
		data: {
			time: Ptime
		},
		async: true, //是否异步
		success: function(responseText) {
			if (responseText.style == 1) {
				for (var i = 0; i < responseText.data.length; i++) {
					var pmin = new Date(responseText.data[i].plan_startime).getHours() * 60 + new Date(responseText.data[i].plan_startime)
						.getMinutes();
					planSet(responseText.data[i].room_id, responseText.data[i].play_id, pmin, responseText.data[i].plan_id, responseText.data[i]);
				}
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("演出计划查询失败");
		},
	})
}

function planSet(planRoomID, planJMID, planstart, planID, planResponse) {
	var prid = "Room-" + planRoomID;
	var Rid = document.getElementById(prid);
	var planLeft = planstart / 1440 * 100 + "%";
	var planWidth = arr1[planJMID].length / 1440 * 100 + "%";
	var div = document.createElement('div');
	div.innerHTML = '<div id="plan-' + planID + '" class="box-plan-in-long" style="left:' + planLeft + ';width:' +
		planWidth + '" onclick="plan_Callback(' + planID + ');"></div>';
	Rid.appendChild(div);
	var datas = {
		play_id: planResponse.play_id,
		room_id: planResponse.room_id,
		plan_startime: planResponse.plan_startime,
		plan_money: planResponse.plan_money,
		plan_language: planResponse.plan_language
	}
	arrplan[planID] = datas;
}

function plan_decision() {
	for(var i=0;i<arrRoomBox.length;i++){
		arrRoomBox[i].innerHTML = '';
	}
}

function planBox(day) {
	arrSearchPlan = [];
	for (var i = 0; i < 4; i++) {
		if (i == (day + 1)) {
			arrday[i].style.background = "rgb(4, 162, 92)";
			arrday[i].style.color = "rgb(255,255,255)";
			dayFlag = day;
			plan_decision();
			planDate = new Date(new Date().getTime()+dayFlag*24*60*60*1000);
			planDay();
			plan_add_decision();
		} else {
			arrday[i].style.background = "rgb(255,255,255)";
			arrday[i].style.color = "rgb(4, 162, 92)";
		}
	}

}

function plan_Callback(planID) {
	planName.innerHTML = arr1[arrplan[planID].play_id].name;
	planName.name = arr1[arrplan[planID].play_id].id;
	planNameFlag = arr1[arrplan[planID].play_id].id;
	planLong.innerHTML = arr1[arrplan[planID].play_id].length + 'min';
	planRoom.value = arrplan[planID].room_id;
	planLanguage.innerHTML = '<option>' + arrplan[planID].plan_language + '</option>';
	var pmin = new Date(arrplan[planID].plan_startime).format('hh:mm');
	planStartTime.value = pmin;
	planTimeFlag = arr1[arrplan[planID].play_id].length;
	planTime();
	planPrice.value = arrplan[planID].plan_money;
}

function play_find() {
	var status = document.getElementById('status1');
	var flag = 0;
	oTab.innerHTML =
		`
	<tbody id="t1"><tr class="kt">
		<th>影片id</th>
		<th>名称</th>
		<th>导演</th>
		<th>类型</th>
		<th>片长</th>
		<th>语言</th>
		<th>状态</th>
		<th>编辑</th>
	</tr>
	</tbody>`
	if (status.value == "all") {
		getmessage()
	} else {
		var n = arrPlanJM.length;
		var i = 0;
		for (i = 0; i < n; i++) {
			if (status.value == arrPlanJM[i].status) {
				flag++;
				var oTr = document.createElement('tr');
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].id;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].name;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].director;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].type;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].length + 'min';
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].language;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanJM[i].status;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td')
				oTd.innerHTML = '<a onclick="del(' + arrPlanJM[i].id +
					')">删除</a>/<a onclick="bianji(' + arrPlanJM[i].id + ')">编辑</a>'
				oTr.appendChild(oTd);
				oTab.tBodies[0].appendChild(oTr);
			}
		}
		if (flag <= 8) {
			document.getElementById('sauto').style.height = (flag + 1) * 51.18 + 'px';
		}
	}
}

function play_search() {
	var oSearch = document.getElementById('oSearch');
	var flag = 0;
	oTab.innerHTML =
		`
	<tbody id="t1"><tr class="kt">
		<th>影片id</th>
		<th>名称</th>
		<th>导演</th>
		<th>类型</th>
		<th>片长</th>
		<th>语言</th>
		<th>状态</th>
		<th>编辑</th>
	</tr>
	</tbody>`
	var sTxt = oSearch.value.toLowerCase()
	var attr = sTxt.split('')
	if (oSearch.value == '') {
		getmessage()
	} else {
		var n = arrPlanJM.length;
		for (var i = 0; i < n; i++) {
			var sTab = arrPlanJM[i].name.toLowerCase()
			for (var j = 0; j < attr.length; j++) {
				if (sTab.search(attr[j]) != -1) {
					flag++;
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].director;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].type;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].length + 'min';
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].language;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanJM[i].status;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td')
					oTd.innerHTML = '<a onclick="del(' + arrPlanJM[i].id +
						')">删除</a>/<a onclick="bianji(' + arrPlanJM[i].id + ')">编辑</a>'
					oTr.appendChild(oTd);
					oTab.tBodies[0].appendChild(oTr);
					break;
				}
			}
		}
	}
	if (flag <= 8) {
		document.getElementById('sauto').style.height = (flag + 1) * 51.18 + 'px';
	}
}

function room_find() {
	var status = document.getElementById('status2');
	var flag = 0;
	oTab2.innerHTML =
		`
			<tbody id="t1"><tr class="kt">
				<th>影厅id</th>
				<th>名称</th>
				<th>行数</th>
				<th>列数</th>
				<th>状态</th>
				<th>编辑</th>
			</tr>
		</tbody>`
	if (status.value == "all") {
		getRoom()
	} else {
		var n = arrPlanRoom.length;
		var i = 0;
		for (i = 0; i < n; i++) {
			if (status.value == arrPlanRoom[i].status) {
				flag++;
				var oTr = document.createElement('tr');
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanRoom[i].id;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanRoom[i].name;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanRoom[i].row;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arrPlanRoom[i].col;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				if (arrPlanRoom[i].status == 1) {
					oTd.innerHTML = "启用";
				} else {
					oTd.innerHTML = "停用";
				}
				oTr.appendChild(oTd);
				var oTd = document.createElement('td')
				oTd.innerHTML = '<a onclick="seatDel(' + arrPlanRoom[i].id + ')">删除</a>/<a onclick="seatBJ(' +
					arrPlanRoom[i].id + ')">编辑</a>'
				oTr.appendChild(oTd);
				oTab2.tBodies[0].appendChild(oTr);
			}

		}

	}
	if (flag <= 8) {
		document.getElementById('sauto1').style.height = (flag + 1) * 51.18 + 'px';
	}
}

function room_search() {
	var oSearch = document.getElementById('oSearch1');
	var flag = 0;
	oTab2.innerHTML =
		`
			<tbody id="t1"><tr class="kt">
				<th>影厅id</th>
				<th>名称</th>
				<th>行数</th>
				<th>列数</th>
				<th>状态</th>
				<th>编辑</th>
			</tr>
		</tbody>`
	var sTxt = oSearch.value.toLowerCase()
	var attr = sTxt.split('')
	if (oSearch.value == '') {
		getRoom();
	} else {
		var n = arrPlanRoom.length;
		for (var i = 0; i < n; i++) {
			var sTab = arrPlanRoom[i].name.toLowerCase();
			for (var j = 0; j < attr.length; j++) {
				if (sTab.search(attr[j]) != -1) {
					flag++;
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanRoom[i].id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanRoom[i].name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanRoom[i].row;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arrPlanRoom[i].col;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					if (arrPlanRoom[i].status == 1) {
						oTd.innerHTML = "启用";
					} else {
						oTd.innerHTML = "停用";
					}
					oTr.appendChild(oTd);
					var oTd = document.createElement('td')
					oTd.innerHTML = '<a onclick="seatDel(' + arrPlanRoom[i].id + ')">删除</a>/<a onclick="seatBJ(' +
						arrPlanRoom[i].id + ')">编辑</a>'
					oTr.appendChild(oTd);
					oTab2.tBodies[0].appendChild(oTr);
					break;
				}
			}
		}
	}
	if (flag <= 8) {
		document.getElementById('sauto1').style.height = (flag + 1) * 51.18 + 'px';
	}
}

function plan_language(i) {
	var arrLanguage = arr1[i].language.split('/');
	planLanguage.innerHTML = '<option value="all">全部</option>';
	for (var i = 0; i < arrLanguage.length; i++) {
		planLanguage.innerHTML += '<option value=' + arrLanguage[i] + '>' + arrLanguage[i] + '</option>';
	}
}

function plan_search() {
	var oSearch = document.getElementById('oSearch2');
	planBox(3);
	dayFlag = 3;
	plan_decision();
	planDate = new Date(new Date(planDate).setFullYear(oSearch.value.split('-')[0],(oSearch.value.split('-')[1]-1),oSearch.value.split('-')[2]));
	console.log(planDate);
	Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/planGet",
		type: "GET",
		data: {
			time: oSearch.value
		},
		async: true, //是否异步
		success: function(responseText) {
			if (responseText.style == 1) {
				for (var i = 0; i < responseText.data.length; i++) {
					var pmin = new Date(responseText.data[i].plan_startime).getHours() * 60 + new Date(responseText.data[i].plan_startime)
						.getMinutes();
					planSet(responseText.data[i].room_id, responseText.data[i].play_id, pmin, responseText.data[i].plan_id, responseText.data[i]);
				}
				plan_add_decision();
			} else {
				alert(responseText.msg);
			}
		},
		fail: function(err) {
			alert("演出计划查询失败");
		},
	})
}

function plan_add(){
	if(planName.innerHTML==''||planLong.innerHTML==''||planRoom.value=='all'||planPrice.value==''||planStartTime.value==''||planEndTime.innerHTML==''||planLanguage.value=='all'){
		alert("演出计划各项属性均不能为空");
	}else if(new Date()>new Date(planDate).setHours(planStartTime.value.split(':')[0],planStartTime.value.split(':')[1],0)){
		alert("只能安排早于当前时间的演出计划");
	}else{
		planDate = new Date(new Date(planDate).setHours(planStartTime.value.split(':')[0],planStartTime.value.split(':')[1],0))
		var datas = {
			dayFlag:dayFlag,
			day:planDate,
			Room:planRoom.value,
			playId:planNameFlag,	
			Language:planLanguage.value,
			Name:planName.innerHTML,
			Long:planLong.innerHTML,		
			Price:planPrice.value,
			StartTime:planStartTime.value,
			EndTime:planEndTime.innerHTML,
			del:false
		}
		arrPlanAdd.push(datas);
		var arrID = arrPlanAdd.length-1;
		plan_add_set(datas,arrID);
	}
}

function plan_add_set(datas,id){
	var prid = "Room-" + datas.Room;
	var Rid = document.getElementById(prid);
	var planstart = Number.parseInt(datas.StartTime.split(':')[0]*60)+Number.parseInt(datas.StartTime.split(':')[1]);
	var planLeft = planstart / 1440 * 100 + "%";
	var planWidth = Number.parseInt(datas.Long) / 1440 * 100 + "%";
	var div = document.createElement('div');
	div.innerHTML = '<div id="add'+id+'" class="box-plan-in-long" style="background: #61B535; left:' + planLeft + ';width:' +
		planWidth + ' " onclick="plan_add_Callback(' + id + ');"></div>';
	Rid.appendChild(div);
}

function plan_add_Callback(id){
	planName.innerHTML = arrPlanAdd[id].Name;
	planName.name = arrPlanAdd[id].id;
	planLong.innerHTML = arrPlanAdd[id].Long;
	planRoom.value = arrPlanAdd[id].Room;
	planPrice.value = arrPlanAdd[id].Price;
	planLanguage.innerHTML = '<option>' + arrPlanAdd[id].Language + '</option>';
	planStartTime.value = arrPlanAdd[id].StartTime;
	planTime();
	document.getElementById('add-del').setAttribute('num',id)
	document.getElementById('add-del').onclick= function(e){		
		var AddID = "add"+e.path[0].attributes.num.nodeValue;
		arrPlanAdd[e.path[0].attributes.num.nodeValue].del = true;
		document.getElementById(AddID).parentNode.removeChild(document.getElementById(AddID));
	}
}

function plan_add_decision(){
	for(var i=0;i<arrPlanAdd.length;i++){
		if(arrPlanAdd[i].del==false){
			if(planDate.getFullYear()==arrPlanAdd[i].day.getFullYear()&&planDate.getMonth()==arrPlanAdd[i].day.getMonth()&&planDate.getDay()==arrPlanAdd[i].day.getDay()){
				plan_add_set(arrPlanAdd[i],i);
			}
		}
	}	
}

function plan_submission1(){
	document.getElementById('plan-sure').style.display="block";
}

function plan_submission2(){
	document.getElementById('plan-sure').style.display="none";
}

function plan_submission3(){
	var arrdata = new Array();
	for(var i=0;i<arrPlanAdd.length;i++){
		if(!arrPlanAdd[i].del){
			var datas = {
				room: arrPlanAdd[i].Room,
				play: arrPlanAdd[i].playId,
				language: arrPlanAdd[i].Language,
				startime: arrPlanAdd[i].day.format('yyyy-MM-dd hh:mm:ss'),
				money:arrPlanAdd[i].Price
			}
			arrdata.push(datas);
		}
	}
	if(arrdata.length==0){
		document.getElementById('plan-sure').style.display="none";
		alert("尚未添加剧目");
	}else{
		Ajax({
			url: "https://www.konghouy.cn/ttmsOperation/planAdd",
			type: "POST",
			data: {plan:arrdata},
			async: true, //是否异步
			success: function(responseText) {
				if (responseText.style == 1) {
					document.getElementById('plan-sure').style.display="none";
					arrPlanAdd = [];
					plan_decision();
					planDay();
				}else{
					alert(responseText.msg);
				}
			},
			fail: function(err) {
				alert("添加失败");
			},
		})
	}
	
}
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function zhuxiao(){
	
}