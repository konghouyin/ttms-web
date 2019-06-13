const express = require('express'); 
var request = require("request");

let server = express();
server.listen(613);


function proxy(url,res) {
	var options = {
		method: 'GET',
		url: url,
		headers: {
			'cache-control': 'no-cache',
			Connection: 'keep-alive',
			'accept-encoding': 'gzip, deflate',
			Host: 'img3.doubanio.com',
			'Cache-Control': 'no-cache',
			Accept: '*/*',
			'User-Agent': 'PostmanRuntime/7.15.0'
		}
	};

	request(options, function(error, response, body) {
		if (error) throw new Error(error);


		console.log(response.headers);
		for(each in response.headers){
			res.header(each,response.headers[each]);
		}

		res.send(body);

		res.end();
	});
}


server.get('/getProxyImage', function(req, res) {
	let obj = req.obj;
	proxy('https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2554370800.jpg',res);
})

