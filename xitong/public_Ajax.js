/*
Ajax({
    url: "", //请求地址
    type: 'get',   //请求方式
    data: { name: 'zhangsan', age: '23', email: '2372734044@qq.com' }, //请求json参数
    async: false,   //是否异步
    success: function (responseText) {
        //   此处执行请求成功后的代码
    },
    fail: function (err) {
        // 此处为执行成功后的代码 
    }
}); */
function Ajax(object) {
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true; //携带cookie
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				object.success(JSON.parse(xhr.responseText), xhr.responseXML);
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
