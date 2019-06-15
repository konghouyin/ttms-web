// pages/orderList/orderList.js
let pageObj;
let model;
let list; //保存所有订单
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: "",
		show: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		pageObj = this;
		pageObj.setData({
			show: options.style
		})
		model = options.style;
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
		getMessage();
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
	ordermain(e) {
		wx.navigateTo({
			url: '/pages/pay/pay?id=' + e.currentTarget.dataset.id
		})
	},
	changeshow(e) {
		model = e.currentTarget.dataset.id;
		pageObj.setData({
			show: model
		})
		findkind();
	}
})


function getMessage() {
	try {
		var value = wx.getStorageSync('userId')
	} catch (e) {
		console.log(e)
	}

	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/selectAllOrder',
		data: {
			id: value,
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			let obj = res.data.data;
			for (let i = 0; i < obj.length; i++) {
				obj[i].orderticket_time = new Date(obj[i].orderticket_time).format('yyyy-MM-dd hh:mm:ss')
			}
			list = obj;
			findkind();
		}
	})
}

function findkind() {
	let arr = [];
	if (model == '1') {
		list.forEach(function(child) {
			if (child.orderticket_status == 1) {
				arr.push(child);
			}
		})
	}else if (model == '2'){
		list.forEach(function(child) {
			if (child.orderticket_status == -1) {
				arr.push(child);
			}
		})
	}else if (model == '3'){
		list.forEach(function(child) {
			if (child.orderticket_status == 0) {
				arr.push(child);
			}
		})
	}else{
		arr=list;
	}
	
	pageObj.setData({
		orderList:arr
	})
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
//data格式化
