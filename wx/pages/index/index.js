var pageObj;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		movieList: [],
		importMovie: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */

	onLoad: function(options) {
		pageObj = this;
		refresh();
        wx.login({
            success(res){
                wxlogin(res.code)
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
		refresh();
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
	
	
	searchbtn() {
		wx.navigateTo({
			url: '/pages/search/search?allMovie=' + JSON.stringify(this.data.movieList)
		})
	},
	//搜索功能

	play(event) {
		var id = event.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/play/play?id=' + id
		})
	}
	//进入剧目具体演出计划页

})

function wxlogin(code){
	wx.request({
		method:"POST",
		url: 'https://www.konghouy.cn/ttmsLogin/wxlogin', //仅为示例，并非真实的接口地址
		data: {code:code},
		header: {
			'content-type': 'application/json' // 默认值
		},
		success(res) {
			console.log(res);
		}
	})
}


function refresh() {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/playNear', //仅为示例，并非真实的接口地址
		data: {},
		header: {
			'content-type': 'application/json' // 默认值
		},
		success(res) {
			let arrAll = [];
			let arrMain = [];
			res.data.data.forEach(function(child) {
				if (child.play_link != "") {
					arrMain.push({
						id: child.play_id,
						image: child.play_link
					})
				}
				arrAll.push({
					id: child.play_id,
					pic: child.play_pic,
					name: child.play_name,
					time: child.play_length,
					actor: child.play_performer,
					type: child.play_type
				})
			})
			pageObj.setData({
				movieList: arrAll,
				importMovie: arrMain
			})
		}
	})
}
//页码数据请求并刷新
