var select1=document.getElementById('select1');
var start1=document.getElementById('start1');
var end1=document.getElementById('end1');
var tbody=document.getElementsByClassName('tbody')[0];
var buttom=document.getElementsByClassName('buttom')[0];
var span=document.getElementsByTagName('span');
function getsale() {
	Ajax({
		url: "https://www.konghouy.cn/ttmsFinance/salerAll",
		type: 'GET',
		data: null,
		async: true,
		success: function(responseText) {
			var select1=document.getElementById('select1');
			for(var i=0;i<responseText.data.length;i++){
				var option=document.createElement('option');
				option.setAttribute('value',responseText.data[i].user_id);
				option.appendChild(document.createTextNode(responseText.data[i].user_name));
				select1.appendChild(option);
			}
		},
		fail: function(err) {
		}
	})
}
getsale();
function qwe(){
	if(start1.value==''||end1.value==""){
		alert('输入查询条件');
	}else if(select1.value=='all' && start1.value!='' && end1.value!=''){
		alert('敬请期待！');
	}
	else{
		tbody.innerHTML='';
		span[0].innerHTML='';
		span[1].innerHTML='';
		if(select1.value=='0'){
			getuser();
		}else{
			getfin();
		}
	}
	
}
function getfin(){
	
	Ajax({
		url: "https://www.konghouy.cn/ttmsFinance//financebyid",
		type: 'GET',
		data: {
			id:select1.value,
			start:start1.value,
			end:end1.value
		},
		async: true,
		success: function(responseText) {
			var count=0;
			var count1=0;
			for(var i=0;i<responseText.data.length;i++){
				count++;
				var tr=document.createElement('tr');
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_id']));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(new Date(responseText.data[i]['sale_time']).format('yyyy-MM-ss hh:mm')));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_money']));
				td.style.width='17%';
				tr.appendChild(td);
				count1+=responseText.data[i]['sale_money'];
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['ticket_id']));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_status']));
				tr.appendChild(td);
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
			var text=document.createTextNode('总计售票数：'+ count);
			span[0].appendChild(text);
			span[1].appendChild(document.createTextNode('总计金额：'+ count1));
		},
		fail: function(err) {
		}
	})
}
function getuser(){
	
	Ajax({
		url: "https://www.konghouy.cn/ttmsFinance/financebyuser",
		type: 'GET',
		data: {
			start:start1.value,
			end:end1.value
		},
		async: true,
		success: function(responseText) {
			var count=0;
			var count1=0;
			for(var i=0;i<responseText.data.length;i++){
				var tr=document.createElement('tr');
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_id']));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');						
				td.appendChild(document.createTextNode(new Date(responseText.data[i]['sale_time']).format('yyyy-MM-ss hh:mm')));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_money']));
				td.style.width='17%';
				tr.appendChild(td);
				count1+=responseText.data[i]['sale_money'];
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['ticket_id']));
				td.style.width='17%';
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_status']));
				tr.appendChild(td);
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
			var text=document.createTextNode('总计售票数：'+ count);
			span[0].appendChild(text);
			span[1].appendChild(document.createTextNode('总计金额：'+ count1));
		},
		fail: function(err) {
		}
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

