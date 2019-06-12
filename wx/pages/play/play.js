// pages/play/play.js
var pageObj;
var idNow;
Page({

	changeDay(event) {
		var num = event.target.dataset.id;
		this.setData({
			timeNow: num,
		})
		screen();//触发筛选
	},
	
	/**
	 * 页面的初始数据
	 */
	data: {
		item: {
			pic: "",
			name: "",
			time: "",
			country: "",
			actor: "",
			type: "",
			style: "",
			language:""
		},
		dayList: [],
		timeNow: 0,
		//当前查看的选择时间
		playList: [],
		showList:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		pageObj = this;
		var id = options.id;
		idNow = id;
		initDay();
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

	},

	main() {
		wx.navigateTo({
			url: '/pages/main/main?id=' + idNow
		})
	},
	sale(e){
		console.log(e);
		if(e.currentTarget.dataset.sale==false){
			return ;
		}else{
			let obj = e.currentTarget.dataset.message;
			wx.navigateTo({
				url: `/pages/choose/choose?name=${pageObj.__data__.item.name}&time=${obj.timestart}&place=${obj.place}&language=${obj.language}&id=${obj.id}&room=${obj.room}&money=${obj.money}`
			})
		}
		
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
				style: data.play_status,
			}
			pageObj.setData({
				item: messageMain,
			})

			wx.setNavigationBarTitle({
				title: data.play_name,
			})
		}
	})
}




function initDay() {
	var now = new Date();
	var arr = [{}, {}, {}, {}, {}];
	arr[0].message = "今天";
	arr[1].message = "明天";
	arr[2].message = "后天";
	arr[3].message = "";
	arr[4].message = "";

	for (var i = 0; i < 5; i++) {
		arr[i].data = now.getUTCDay()+1;
		arr[i].day = now.format("MM月dd日");
		now.setDate(now.getDate() + 1);
	}
	arr[0].style = "active";
	pageObj.setData({
		dayList: arr,
		timeNow:new Date().getUTCDay()+1
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


function getPlan(id) {
	wx.request({
		url: 'https://www.konghouy.cn/ttmsSale/planList',
		data: {
			id: id
		},
		header: {
			'content-type': 'application/json'
		},
		success(res) {
			let data = res.data.data;
			pageObj.setData({
				playList: data,
			})
			screen();
		}
	})
}
//获取演出计划

function screen(){
	let back = [];
	let arr = pageObj.__data__.playList.filter(function(child){
		return child.data == pageObj.__data__.timeNow;
	})
	arr.forEach(function(child){
		back.push({
			room:child.room_id,
			id:child.plan_id,
			timestart:new Date(child.plan_startime).format("hh:mm"),
			place:child.room_name,
			money:child.plan_money,
			language:child.plan_language,
			sale:new Date(child.plan_startime)<new Date()?false:true
		})
	})
	pageObj.setData({
		showList: back,
	})
}