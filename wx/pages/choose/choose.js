// pages/choose/choose.js
let pageObj;
let money; //计划的票价
let arrAll = new Map(); //票
let arrSale = new Map(); //已经卖出的票
let arr = [];
let chooseTicket= new Map();
let option;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		line: [],
		item: {},
		chooseList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		option = options;
		money = options.money;
		pageObj = this;
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
		arrAll = new Map(); //票
		arrSale = new Map(); //已经卖出的票
		arr = [];
		chooseTicket= new Map();
		getTicket(option.id, option.room);
		pageObj.setData({
			item: {
				name: option.name,
				language: option.language,
				place: option.place,
				time: option.time,
			},
			money: option.money,
			moneyAll: 0
		})
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
	choose(e) {
		let data = e.currentTarget.dataset.message;
		if (data.seat_status == 0) {
			arr[data.seat_row - 1][data.seat_col - 1].seat_status = 1;
			chooseTicket.set(data.ticket_id, data);
		} else if (data.seat_status == 1) {
			arr[data.seat_row - 1][data.seat_col - 1].seat_status = 0;
			chooseTicket.delete(data.ticket_id);
		} else {
			return;
		}
		pageObj.setData({
			line: arr,
			chooseList: [...chooseTicket],
			moneyAll: ([...chooseTicket].length * money).toFixed(2)
		})

	},
	remove(e) {
		let data = e.currentTarget.dataset.message[1];
		arr[data.seat_row - 1][data.seat_col - 1].seat_status = 0;
		chooseTicket.delete(data.ticket_id);
		pageObj.setData({
			line: arr,
			chooseList: [...chooseTicket],
			moneyAll: ([...chooseTicket].length * money).toFixed(2)
		})
	},
	order() {
		if (chooseTicket.lenth == 0) {
			return;
		} else {
			wx.showLoading({
				title: "正在生成订单"
			})
			let arr = [];
			for (let child of chooseTicket.values()) {
				arr.push(child.ticket_id);
			}
			orderTicket(arr)
		}
	}
})

function orderTicket(arr) {
	try {
		var value = wx.getStorageSync('userId')
	} catch (e) {
		console.log(e)
	}

	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/order',
		method: "post",
		data: {
			id: value,
			ticket: arr
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			wx.hideLoading();
			if (res.data.style != 1) {
				wx.showToast({
					title: '预定失败',
					icon: 'none',
					duration:2000
				})
			}else{
				wx.navigateTo({
					url:'/pages/pay/pay?id='+res.data.id
				})
			}
		}
	})
}
//发送预定信息

function getSeat(id) {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsOperation/roomMain',
		data: {
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			var seat = res.data.data;
			for (let i = 0; i < seat.length; i++) {
				if (seat[i].seat_status == 1) {
					seat[i].ticket_id = arrAll.get(seat[i].seat_id);
					if (arrSale.has(seat[i].seat_id)) {
						seat[i].seat_status = -2;
					} else {
						seat[i].seat_status = 0;
					}
				} else if (seat[i].seat_status == 0) {
					seat[i].seat_status = -2;
				}
			}

			for (let i = 0; i < seat.length; i++) {
				let n = seat[i].seat_row;
				let x = [];
				for (; i < seat.length && seat[i].seat_row == n; i++) {
					x.push(seat[i]);
				}
				arr.push(x);
				i--;
			}
			console.log(arr);
			pageObj.setData({
				line: arr
			})
		}
	})
}


function getTicket(id, seatId) {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/ticketList',
		data: {
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			res.data.dataSale.forEach((child) => {
				arrSale.set(child.seat_id, child.ticket_id);
			})
			res.data.dataAll.forEach((child) => {
				arrAll.set(child.seat_id, child.ticket_id);
			})
			getSeat(seatId);
		}
	})
}
