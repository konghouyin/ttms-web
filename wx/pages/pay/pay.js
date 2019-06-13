// pages/pay/pay.js
let pageObj;
let ticketid;
let timer;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		money: "",
		lasttime: "",
		status: "",
		ticketstatus: "",
		item: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		pageObj = this;
		ticketid = options.id;
		selectOrder(options.id);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	phone() {
		wx.makePhoneCall({
			phoneNumber: "15399475736"
		})
	},
	payNow() {
		wx.showLoading({
			title: "安全系统启动中"
		})
		setTimeout(function() {
			wx.hideLoading()
		}, 500);
		wx.startSoterAuthentication({
			requestAuthModes: ['fingerPrint'],
			challenge: ticketid.toString(),
			authContent: '验证指纹完成支付',
			success(res) {
				paySend(ticketid);
			}
		})
	}
})

function paySend(id) {
	try {
		var userId = wx.getStorageSync('userId')
	} catch (e) {
		console.log(e);
	}


	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/saleOrder',
		method:"post",
		data: {
			userId: userId,
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			if (res.data.style == 1) {
				wx.showModal({
					title: "支付成功",
					content: "您已完成支付，祝您观影愉快！",
					showCancel: false,
					success(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							wx.switchTab({
								url: "/pages/index/index"
							})
						}
					}
				})
			} else {
				wx.showModal({
					title: "支付失败",
					content: "支付过程出现问题，请重新支付！",
					showCancel: false,
				})
			}
		}
	})
}
//购买影票

function selectOrder(id) {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/selectOrder',
		data: {
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res.data);
			let order = res.data.order[0];
			let play = res.data.play[0];
			let ticket = res.data.ticket;
			try {
				clearInterval(timer);
			} catch (e) {}
			timer = setInterval(function() {
				pageObj.setData({
					lasttime: methodTime(order.orderticket_time),
					status: methodTime(order.orderticket_time) == '00:00' ? false : true
				})
			}, 1000)

			pageObj.setData({
				item: {
					pic: play.play_pic,
					name: play.play_name,
					time: new Date(play.plan_startime).format('MM月dd日 hh:mm'),
					language: play.plan_language,
					place: play.room_name
				},
				orderid: id,
				ordertime: new Date(order.orderticket_time).format('yyyy-MM-dd hh:mm:ss'),
				ticket: ticket,
				ticketstatus: order.orderticket_status,
				money: order.orderticket_money,
				moneyonce: (order.orderticket_money / ticket.length).toFixed(2),
				lasttime: methodTime(order.orderticket_time),
				status: methodTime(order.orderticket_time) == '00:00' ? false : true
			})
		}
	})
}
//订单查询

function methodTime(starttime) {
	var ms = 10 * 60 * 999 - new Date().getTime() + new Date(starttime).getTime();
	ms = Number.parseInt(ms / 1000);
	if (ms < 0) {
		return "00:00";
	} else {
		return doublewei(Number.parseInt(ms / 60)) + ":" + doublewei(Number.parseInt(ms % 60));
	}
}

function doublewei(num) {
	if (num < 10) {
		return "0" + num;
	}
	return num;
}
//计算时间

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
//data格式化
