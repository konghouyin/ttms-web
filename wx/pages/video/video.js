// pages/video/video.js
let pageObj;
Page({

    /**
     * 页面的初始数据
     */
    data: {
		playList:[],
		playNow:"",
		playNumber:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: options.name+"预告片",
		})
		pageObj = this;
		getMoreVideo(options.url);
		
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
	buy() {
		wx.navigateBack({
			delta: 2
		})
	},
	change(e){
		console.log(e);
		if(e.currentTarget.dataset.num==pageObj.__data__.playNumber){
			return ;
		}else{
			getMovie(e.currentTarget.dataset.link);
			pageObj.setData({
				playNumber:e.currentTarget.dataset.num
			})
		}
	}
})

function getMovie(path){
	wx.request({
		url: 'https://www.konghouy.cn/path/showMovie?url='+path,
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			pageObj.setData({
				playNow:res.data.showMovie.movie
			})
		}
	})
}

function getMoreVideo(path){
	wx.request({
		url: 'https://www.konghouy.cn/path/showMovieAll?url='+path,
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			console.log(res);
			getMovie(res.data.showMovieAll[0].link);
			let arr=[];
			res.data.showMovieAll.forEach(function(child){
				arr.push({
					link:child.link,
					pic:child.img,
					time:child.long,
					title:child.title,
					date:child.time
				})
			})
			
			pageObj.setData({
				playList:arr
			})
			
		}
	})
}