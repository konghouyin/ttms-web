// pages/choose/choose.js
let pageObj;
let money; //计划的票价
let arrAll = new Map(); //票
let arrSale = new Map(); //已经卖出的票
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		line: [],
		item: {}

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		pageObj = this;
		getTicket(options.id, options.room);


		pageObj.setData({
			item: {
				name: options.name,
				language: options.language,
				place: options.place,
				time: options.time,
			}
		})
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
})

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
				if(seat[i].seat_status==1){
					seat[i].ticket_id=arrAll.get(seat[i].seat_id);
					if(arrSale.has(seat[i].seat_id)){
						seat[i].seat_status=-2;
					}else{
						seat[i].seat_status=0;
					}
				}else if(seat[i].seat_status==0){
					seat[i].seat_status=-2;
				}
			}


			let arr=[];
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
			res.data.dataSale.forEach((child)=>{
				arrSale.set(child.seat_id,child.ticket_id);
			})
			res.data.dataAll.forEach((child)=>{
				arrAll.set(child.seat_id,child.ticket_id);
			})
			getSeat(seatId);
		}
	})
}
