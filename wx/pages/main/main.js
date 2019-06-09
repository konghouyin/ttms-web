// pages/main/main.js
var page;

var pageObj;
var moreMessage;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		item: {},
		synopsis: "",
		person: "",
		movie: "",
		pic: "",
		comment: "",
		synopsised: "message-hidden"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		pageObj = this;
		var id = options.id;

		getMessage(id);
		getPlan(id);

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

	}
})


function getMessage(id) {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsOperation/playMain',
		data: {
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			let data = res.data.data;
			var messageMain = {
				pic: data.play_pic,
				name: data.play_name,
				time: data.play_length,
				country: data.play_country,
				actor: data.play_performer,
				type: data.play_type,
				style: data.play_status
			}

			moreMessage = JSON.parse(data.play_message).index;

			var synopsis = moreMessage.synopsis;
			var person = moreMessage.person;
			var movie = moreMessage.showMovie;
			var pic = moreMessage.pic;
			var comment = moreMessage.shortCommentary;

			pageObj.setData({
				item: messageMain,
				synopsis: synopsis,
				person: person,
				movie: movie,
				pic: pic,
				comment: comment
			})

			wx.setNavigationBarTitle({
				title: data.play_name,
			})
		}
	})
}

