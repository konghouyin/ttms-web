var oTab = document.getElementById('table1');
var arr = new Array();
window.onload = function() {
	getmessage();
}

function change(id) {
	var button = document.getElementById(id);
	button.style.background = "rgb(5, 174, 99)";
	button.style.color = "rgb(255, 255, 255)";
	button.style.cursor = "pointer";
}

function getmessage() {
	Ajax({
		url: "https://www.konghouy.cn/ttmsLogin/userAll",
		type: "GET",
		data: null,
		async: true,
		success: function(responseText) {
			if (responseText.style == 0) {
				arr = responseText.data;
				var n = responseText.data.length;
				var i = 0;
				for (i = 0; i < n; i++) {
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].user_id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = responseText.data[i].user_name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = '<input value="" onkeydown="change(' + responseText.data[i].user_id + ');" maxlength="12"/>';
					oTr.appendChild(oTd);
					if (responseText.data[i].user_tel) {
						var oTd = document.createElement('td');
						oTd.innerHTML = '<input value="' + responseText.data[i].user_tel + '" onkeydown="change(' + responseText.data[
							i].user_id + ');" maxlength="11"/>';
						oTr.appendChild(oTd);
					} else {
						var oTd = document.createElement('td');
						oTd.innerHTML = '<input value="" onkeydown="change(' + responseText.data[i].user_id + ');" maxlength="11"/>';
						oTr.appendChild(oTd);
					}
					var oTd = document.createElement('td');
					oTd.innerHTML =
						`<select onclick="change(` + responseText.data[i].user_id +
						`);">
									<option value="0">待定</option>
									<option value="1">运营</option>
									<option value="2">销售</option>
									<option value="3">财务</option>
									<option value="4">个人</option>
								</select> `
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = '<button id="' + responseText.data[i].user_id + '" onclick="bijian(' + responseText.data[i].user_id +
						')">确定</button>';
					oTr.appendChild(oTd);
					oTab.tBodies[0].appendChild(oTr);
					var oUser = document.getElementById(responseText.data[i].user_id);
					oUser.parentNode.parentNode.children[4].children[0][responseText.data[i].user_status].selected = true;
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

function bijian(id) {
	var oUser = document.getElementById(id);
	if (oUser.parentNode.parentNode.children[2].children[0].value) {
		var flag = 1;
	} else {
		var flag = 0;
	}
	Ajax({
		url: "https://www.konghouy.cn/ttmsLogin/userEdit",
		type: "POST",
		data: {
			id: oUser.parentNode.parentNode.children[0].innerHTML,
			status: oUser.parentNode.parentNode.children[4].children[0].value,
			password: hex_md5(oUser.parentNode.parentNode.children[2].children[0].value),
			tel: oUser.parentNode.parentNode.children[3].children[0].value,
			passwordchange: flag
		},
		async: true,
		success: function(responseText) {
			if (responseText.style == 1) {
				oTab.innerHTML =
					`
						<tbody id="t1"><tr class="kt">
							<th>用户id</th>
							<th>用户名</th>
							<th>密码</th>
							<th>手机号</th>
							<th>职位</th>
							<th>编辑</th>
						</tr>
					</tbody>`
				getmessage();

			} else {
				alert(responseText.msg)
			}
		},
		fail: function(err) {
			alert("数据请求失败")
		}
	})
}

function user_find() {
	oTab.innerHTML =
		`
			<tbody id="t1"><tr class="kt">
				<th>用户id</th>
				<th>用户名</th>
				<th>密码</th>
				<th>手机号</th>
				<th>职位</th>
				<th>编辑</th>
			</tr>
		</tbody>`
	var status = document.getElementById('status1');
	if (status.value == 'all') {
		getmessage()
	} else {
		for (var i = 0; i < arr.length; i++) {
			if (status.value == arr[i].user_status) {
				var oTr = document.createElement('tr');
				var oTd = document.createElement('td');
				oTd.innerHTML = arr[i].user_id;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = arr[i].user_name;
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = '<input value="" onkeydown="change(' + arr[i].user_id + ');" maxlength="12"/>';
				oTr.appendChild(oTd);
				if (arr[i].user_tel) {
					var oTd = document.createElement('td');
					oTd.innerHTML = '<input value="' + arr[i].user_tel + '" onkeydown="change(' + arr[i].user_id +
						');" maxlength="11"/>';
					oTr.appendChild(oTd);
				} else {
					var oTd = document.createElement('td');
					oTd.innerHTML = '<input value="" onkeydown="change(' + arr[i].user_id + ');" maxlength="11"/>';
					oTr.appendChild(oTd);
				}
				var oTd = document.createElement('td');
				oTd.innerHTML =
					`<select onclick="change(` + arr[i].user_id +
					`);">
								<option value="0">待定</option>
								<option value="1">运营</option>
								<option value="2">销售</option>
								<option value="3">财务</option>
								<option value="4">个人</option>
							</select> `
				oTr.appendChild(oTd);
				var oTd = document.createElement('td');
				oTd.innerHTML = '<button id="' + arr[i].user_id + '" onclick="bijian(' + arr[i].user_id +
					')">确定</button>';
				oTr.appendChild(oTd);
				oTab.tBodies[0].appendChild(oTr);
				var oUser = document.getElementById(arr[i].user_id);
				oUser.parentNode.parentNode.children[4].children[0][arr[i].user_status].selected = true;
			}
		}
	}
}

function user_search() {
	oTab.innerHTML =
		`
			<tbody id="t1"><tr class="kt">
				<th>用户id</th>
				<th>用户名</th>
				<th>密码</th>
				<th>手机号</th>
				<th>职位</th>
				<th>编辑</th>
			</tr>
		</tbody>`
	var oSearch = document.getElementById('oSearch');
	var attr = oSearch.value.toLowerCase().split('');
	if (oSearch.value == '') {
		getmessage();
	} else {
		var n = arr.length;
		for (var i = 0; i < n; i++) {
			var sTab = arr[i].user_name.toLowerCase();
			for (var j = 0; j < attr.length; j++) {
				if (sTab.search(attr[j]) != -1) {
					var oTr = document.createElement('tr');
					var oTd = document.createElement('td');
					oTd.innerHTML = arr[i].user_id;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = arr[i].user_name;
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = '<input value="" onkeydown="change(' + arr[i].user_id + ');" maxlength="12"/>';
					oTr.appendChild(oTd);
					if (arr[i].user_tel) {
						var oTd = document.createElement('td');
						oTd.innerHTML = '<input value="' + arr[i].user_tel + '" onkeydown="change(' + arr[i].user_id +
							');" maxlength="11"/>';
						oTr.appendChild(oTd);
					} else {
						var oTd = document.createElement('td');
						oTd.innerHTML = '<input value="" onkeydown="change(' + arr[i].user_id + ');" maxlength="11"/>';
						oTr.appendChild(oTd);
					}
					var oTd = document.createElement('td');
					oTd.innerHTML =
						`<select onclick="change(` + arr[i].user_id +
						`);">
									<option value="0">待定</option>
									<option value="1">运营</option>
									<option value="2">销售</option>
									<option value="3">财务</option>
									<option value="4">个人</option>
								</select> `
					oTr.appendChild(oTd);
					var oTd = document.createElement('td');
					oTd.innerHTML = '<button id="' + arr[i].user_id + '" onclick="bijian(' + arr[i].user_id +
						')">确定</button>';
					oTr.appendChild(oTd);
					oTab.tBodies[0].appendChild(oTr);
					var oUser = document.getElementById(arr[i].user_id);
					oUser.parentNode.parentNode.children[4].children[0][arr[i].user_status].selected = true;
					break;
				}
			}
		}
	}
}
