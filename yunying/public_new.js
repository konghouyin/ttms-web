ajax({
	url: "https://www.konghouy.cn/ttmsOperation/new",
	type: 'get',
	data: null,
	async: true,
	success: function(responseText) {
		if (JSON.parse(responseText).style != 1) {
			alert("登录异常，请重新登录！");
			window.location.href = "https://www.konghouy.cn/ttms/login/login.html";
		} else {
			
		}
	},
	fail: function(err) {
		alert('网络错误');
		window.location.href = "https://www.konghouy.cn/ttms/login/login.html";
	}
});

function ajax(object) {
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true; //携带cookie
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				object.success(xhr.responseText, xhr.responseXML);
			} else {
				object.fail(xhr.status);
			}
		}
	};

	if (object.type.toLowerCase() == 'get') {
		xhr.open("get", object.url + "?" + getMessage(object.data), object.async);
		xhr.send(null);
	} else if (object.type.toLowerCase() == 'post') {
		xhr.open("post", object.url, object.async);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(JSON.stringify(object.data));
	}
}

function getMessage(data) {
	let arr = [];
	for (each in data) {
		if (data[each] instanceof Object) {
			data[each] = JSON.stringify(data[each]);
		}
		arr.push(`${escape(each)}=${escape(data[each])}`);
	}
	return arr.join('&');
}