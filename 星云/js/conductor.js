// 左边影片信息table声明
var oTab=document.getElementById("movie-item");
var otr=document.createElement("tr");
//储存影片详情，在第一次访问影片信息后，在显示影片信息时将访问到的影片所有数据存到数组中，以便于查询相应的详细信息
var arr1=new Array();  


var outbox1 = document.getElementById('outbox1');
var main0 = document.getElementById('main0');
var maindetail = document.getElementById('main-detail');
// 影片详情
var infor0 = document.getElementById('outbox1-infor0');
var infor1 = document.getElementById('outbox1-infor1');
var infor2 = document.getElementById('outbox1-infor2');
var infor3 = document.getElementById('outbox1-infor3');
var infor4 = document.getElementById('outbox1-infor4');
var infor5 = document.getElementById('outbox1-infor5');
var infor6 = document.getElementById('outbox1-infor6');
var infor7 = document.getElementById('outbox1-infor7');
//剧目信息
var jumuname =document.getElementById("jumu-name");
// var jumuitem = document.getElementById("jumu-item"); 
// var time = document.getElementById("time");
// var timestart = document.getElementById("time-start");
// var timend = document.getElementById("time-end");
// var lang = document.getElementById("language");
// var price = document.getElementById("price")
var riqi1 = document.getElementById("riqi1");
var riqi2 = document.getElementById("riqi2");
var riqi3 = document.getElementById("riqi3");
var lala = document.getElementById('lala');
// 票的信息
var ticketroomname = document.getElementById('ticket-roomname');
var ticketseatrow = document.getElementById('ticket-seatrow');
var ticketseatcol = document.getElementById('ticket-seatcol');
var ticketplayname = document.getElementById('ticket-playname');
var ticketstartime = document.getElementById('ticket-startime');
var ticketmoney = document.getElementById('ticket-money');

// 销售信息

var titleitem1 =  document.getElementById('title-item1')
var titleitem2 =  document.getElementById('title-item2')
var titleitem3 =  document.getElementById('title-item3')
var titleitem4 =  document.getElementById('title-item4')
var titleitem5 =  document.getElementById('title-item5')


window.onload = function(){
    add0();  //调用影片信息
    // add1();  //显示演出计划
    // test();
    // zuowei();
    move(outbox1,20,288,main0);
    move(outbox2,20,288,main0);
}

// function test(){
//     // var otime = document.createElement('div');
//     // otime.innerHTML="qweqwe";
//     // var timestart = document.getElementById("time-start");
//     // timestart.appendChild(otime);
//     var id="weqw"
//     var t="12:13"
//     var time = document.getElementById("box");
//     time.innerHTML+=`<div class="jumu-item" id="jumu-item">
//     <div class="time" id="time">
//         <div class="time-start" id="`+ id +`">`+ t +`</div>
//         <div class="time-end" id="time-end">19:58散场</div>
        
//     </div>
//     <div class="language" id="lang">英语</div>
//     <div class="price" id="price">￥26.9</div>
//     <div class="goumai-txt" id="goumai">购买</div>
// </div>`
 // `
                       
// <div class="time" id="time">
//     <div class="time-start" id="time-start">`+ responseText.data[4].play_startime +`</div>
//     <div class="time-end" id="time-end">散场</div>  
// </div>
//     <div class="language" id="lang">英语</div>
//     <div class="price" id="price">`+ responseText.data[4].play_money +`</div>
//     <div class="goumai-txt" id="goumai">购买</div>
// ` 
// }





var  arr1=[];

// 显示影片信息
function add0() {
	Ajax({
		url: "https://www.konghouy.cn/ttmsSale/playNear",
		type: "GET",
		data: null,
		async: true,
		success: function(responseText) {          
            var n=responseText.data.length;
            console.log('显示正在热映的影片信息');
            console.log(responseText);
            for(let i = 0 ; i < n ; i++ ){  
                if (responseText.style == 1) {
                    //绑定属性
                        var oTr=document.createElement('tr')
                        oTr.setAttribute('data-id',responseText.data[i].play_id)
                        oTr.setAttribute('data-name',responseText.data[i].play_name)

                        var oTd=document.createElement('td')
                        oTd.innerHTML='<img style="width:80%;height:90%" src="'+ responseText.data[i].play_pic +'"/>'
                        oTr.appendChild(oTd)
                        
                        var oTd=document.createElement('td')
                        oTd.innerHTML=responseText.data[i].play_name
                        oTr.appendChild(oTd)
                        
                        var oTd=document.createElement('td') 
                        oTd.innerHTML=responseText.data[i].play_type
                        oTr.appendChild(oTd)  

                        // 调用影片详情
                        var oTd=document.createElement('td') 
                        oTd.innerHTML='<img onclick="xiangqing('+responseText.data[i].play_id +')" style="width:20%;    cursor:pointer; float:right;margin-right:22px;" src="../image/箭头.png"/> '
                        //变小手
                        onmouseover="this.style.cursor='hand'";
                        onmouseout="this.style.cursor='normal'";
                        oTr.appendChild(oTd)
                        oTab.tBodies[0].appendChild(oTr)  //一个table里面只有一个tbody。打包一个tbody
                        
                        oTr.onclick = function(e){
                            var tr;
                            // console.log(e);
                            // console.log(e.path);
                            if(e.path.length==11){
                                tr = e.path[1]
                            }if(e.path.length==12){
                                tr =(e.path[2])
                            }
                            // console.dir(tr)   显示tr相关信息
                            jumuname.innerHTML = tr.dataset.name;
                            var playID=tr.dataset.id;
                            openplan();
                            console.log(playID)
                            add1(playID);

                        }
                        var datas={
                            id:responseText.data[i].play_id,
                            pic:responseText.data[i].play_pic,
                            name:responseText.data[i].play_name,
                            length:responseText.data[i].play_length,
                            language:responseText.data[i].play_language,
                            type:responseText.data[i].play_type,
                            country:responseText.data[i].play_country,
                            director:responseText.data[i].play_director,
                            performer:responseText.data[i].play_performer,
                       }
                        arr1[responseText.data[i].play_id]=datas;

                    }
                else {
                    alert("数据请求失败")
                }
            }
		},

		fail: function(err) {
			alert("数据请求失败")
		}
	})
}

// 影片详情
function xiangqing(playID){
    var outbox=document.getElementById('outbox1');
    outbox.style.display = 'block'
    infor0.innerHTML = ""+'<img src="'+arr1[playID].pic+'" />'
    infor1.innerHTML = "名字： "+arr1[playID].name
    infor2.innerHTML = "时长:  "+arr1[playID].length
    infor3.innerHTML = "语言： "+arr1[playID].language
    infor4.innerHTML = "类型："+arr1[playID].type
    infor5.innerHTML = "国家："+arr1[playID].country
    infor6.innerHTML = "导演："+arr1[playID].director
    infor7.innerHTML = "演员："+arr1[playID].performer
    
}   



//关闭影片详情
function closexiangqing(){
    var outbox=document.getElementById('outbox1');
    outbox.style.display =  'none'
}

//整体导航切换
var item=document.getElementById('main0');
var item1=document.getElementById('main1');
var item2=document.getElementById('main2');
var arr0=new Array();
    arr0[0]=main0;
    arr0[1]=main1;
    arr0[2]=main2;
function changes(n){
    console.log(arr0)
    var j;
    for(j=0;j<arr0.length;j++){
        if(j==n){
            
            arr0[j].style.display="block";
        }
        else{
            arr0[j].style.display="none";
        }
    }
}



var riqi1 = document.getElementById("riqi1");
var riqi2 = document.getElementById("riqi2");
var riqi3 = document.getElementById("riqi3");
var arriqi = new Array();
arriqi[0]=riqi1;
arriqi[1]=riqi2;
arriqi[2]=riqi3;
//演出计划导航切换
var box=document.getElementById('box');
var box1=document.getElementById('box1');
var box2=document.getElementById('box2');
var arr=new Array();
arr[0]=box;
arr[1]=box1;
arr[2]=box2;
function change(n){
    var i;
    for(i=0;i<arr.length;i++){
        if(i==n){
            arr[i].style.display="block";
            arriqi[i].style.color = "rgb(5, 174, 99)";

         
        }
        else{
            arr[i].style.display="none";
            arriqi[i].style.color = "black";

        }
    }
}
    

//打开演出计划模块
function openplan(){
    // console.log("打开计划模块");
    var outbox=document.getElementById('main-detail');
    outbox.style.display = "block";
}



//显示演出计划
function add1(playID){
    Ajax({
		url: "https://www.konghouy.cn/ttmsSale/planList",
		type: "GET",
		data: {id:playID},
		async: true,
		success: function(responseText) {
            console.log("进五天的演出计划")
            var date = new Date();
            var id = playID;
            let mouth = date.getMonth() +1;
            let day0 = date.getDate();
            let day1 = day0 + 1;
            let day2 = day1 +1;




            riqi1.innerHTML = mouth + '月' + day0 + '号';
            riqi2.innerHTML = mouth + '月' + day1 + '号';
            riqi3.innerHTML = mouth + '月' + day2 + '号';
            console.log(responseText);
            var n=responseText.data.length


            var jumuitem0 = document.getElementById("box");
            var jumuitem1 = document.getElementById("box1");
            var jumuitem2 = document.getElementById("box2");
            jumuitem0.innerHTML = "";
            jumuitem1.innerHTML = "";
            jumuitem2.innerHTML = "";
            for(let i = 0 ; i < n; i++ ){                 
                if (responseText.style == 1) {
                    var timela0 = responseText.data[i].plan_startime; 
                    var timela1 = new Date(timela0);
                    var rila = timela1.getDate();

                    if( rila == day0 ){
                        console.log('显示剧目信息'+i);   
                        console.log(responseText);
                        // var roomID = responseText.data[i].room_id;
                        // var planID = responseText.data[i].plan_id;
                        // yingting(responseText.data[i].room_id);
                        // zuowei(responseText.data[i].plan_id)

                        var myDate = new Date(responseText.data[i].plan_startime);
                        
                        var shifen = myDate.format('hh:mm')
                        jumuitem0.innerHTML += `
                        <div class="jumu-item " style="display:block" id="jumu-item">
                            <div class="time" id="time">
                                <div class="time-start" id="time-start">`+ shifen +`</div>
                                <div class="time-end" id="time-end"> `+ responseText.data[i].room_name +`</div>  
                            </div>
                                <div class="language" id="lang">`+ responseText.data[i].plan_language +`</div>
                                <div class="price" id="price">`+ responseText.data[i].plan_money +`</div>
                                <div class="goumai-txt" id="goumai" style="cursor:pointer;" onclick ="yingting(`+responseText.data[i].room_id+`); zuowei(`+responseText.data[i].plan_id+`);" >购买</div>
                                </div>
                            `               
                           
                            var jiage =document.getElementById('outbox2');  
                            // console.log("将单价和座位弹出框绑定到一起，方便算价格");
                            jiage.setAttribute('data-danjia',responseText.data[i].plan_money);

                    }
                    if( rila == day1 ){
                        console.log('显示剧目信息'+i);   
                        console.log(responseText);
                        // var roomID = responseText.data[i].room_id;
                        // var planID = responseText.data[i].plan_id;
                        // yingting(responseText.data[i].room_id);
                        // zuowei(responseText.data[i].plan_id)
                        var myDate = new Date(responseText.data[i].plan_startime);
                        var shifen = myDate.format('hh:mm')
                        jumuitem1.innerHTML += `
                        <div class="jumu-item " style="display:block" id="jumu-item">
                            <div class="time" id="time">
                                <div class="time-start" id="time-start">`+ shifen +`</div>
                                <div class="time-end" id="time-end"> `+ responseText.data[i].room_name +`</div>  
                            </div>
                                <div class="language" id="lang">`+ responseText.data[i].plan_language +`</div>
                                <div class="price" id="price">`+ responseText.data[i].plan_money +`</div>
                                <div class="goumai-txt" id="goumai" style="cursor:pointer;" onclick ="yingting(`+responseText.data[i].room_id+`); zuowei(`+responseText.data[i].plan_id+`);" >购买</div>
                                </div>
                            `               
                           
                            var jiage =document.getElementById('outbox2');  
                            // console.log("将单价和座位弹出框绑定到一起，方便算价格");
                            jiage.setAttribute('data-danjia',responseText.data[i].plan_money);

                    }
                    
                    if( rila == day2 ){
                        console.log('显示剧目信息'+i);   
                        console.log(responseText);
                        // var roomID = responseText.data[i].room_id;
                        // var planID = responseText.data[i].plan_id;
                        // yingting(responseText.data[i].room_id);
                        // zuowei(responseText.data[i].plan_id)
                        var myDate = new Date(responseText.data[i].plan_startime);
                        var shifen = myDate.format('hh:mm')
                        jumuitem2.innerHTML += `
                        <div class="jumu-item " style="display:block" id="jumu-item">
                            <div class="time" id="time">
                                <div class="time-start" id="time-start">`+ shifen +`</div>
                                <div class="time-end" id="time-end"> `+ responseText.data[i].room_name +`</div>  
                            </div>
                                <div class="language" id="lang">`+ responseText.data[i].plan_language +`</div>
                                <div class="price" id="price">`+ responseText.data[i].plan_money +`</div>
                                <div class="goumai-txt" id="goumai" style="cursor:pointer;" onclick ="yingting(`+responseText.data[i].room_id+`); zuowei(`+responseText.data[i].plan_id+`);" >购买</div>
                                </div>
                            `               
                           
                            var jiage =document.getElementById('outbox2');  
                            // console.log("将单价和座位弹出框绑定到一起，方便算价格");
                            jiage.setAttribute('data-danjia',responseText.data[i].plan_money);

                    }
                    
                    
                   
                    
                    }
                }           
		},

		fail: function(err) {
			alert("数据请求失败")
		}
	})  
}




// 弹出框移动
function move(qwq, a, b, bqwq) {
	var div = qwq;
	var dragFlag = false;
	var x, y, marginTop, marginLeft;

	div.onmousedown = function(e) {
		e = e || window.event;
		x = e.clientX;
		y = e.clientY;
		marginTop = Number.parseInt(div.style.marginTop) || a;
		marginLeft = Number.parseInt(div.style.marginLeft) || b;
		if (e.path[0].tagName != "INPUT") {
			dragFlag = true;
		}
	};

	bqwq.onmousemove = function(e) {
		if (dragFlag) {
			e = e || window.event;
			div.style.marginLeft = e.clientX - x + marginLeft + "px";
			div.style.marginTop = e.clientY - y + marginTop + "px";
		}
	};

	bqwq.onmouseup = function(e) {
		dragFlag = false;
	};

}



//关闭整体座位详情
function closeatxiangqing(){
    var outbox=document.getElementById('outbox2');
    outbox.style.display =  'none'
}



var num

// 影厅座位列表
function yingting(roomID ){
    Ajax({
		url: "https://www.konghouy.cn/ttmsOperation/roomMain",
		type: "GET",
		data: {id:roomID},
		async: true,
		success: function(responseText) { 
      
            console.log('显示座位列表详细');
            console.log(responseText);
            console.log('显示座位个数');
            console.log(responseText.data.length);
            lala.innerHTML ='';
            div = "";
            var n = responseText.data.length;
            var rowmax = 0;
            var colmax = 0;
            for( var i = 0; i < n ; i++){
                if( responseText.data[i].seat_row > rowmax ){
                    rowmax = responseText.data[i].seat_row;
                }
                if( responseText.data[i].seat_col > colmax ){
                    colmax = responseText.data[i].seat_col;
                }
            }
            num = 0;

            for( let i = 1; i <= rowmax ; i++){
                for( let j = 1; j <= colmax ; j++){
                    if( responseText.data[num].seat_status == 1 ){
                        let div = document.getElementById('lala').getElementsByTagName('div');
                        lala.innerHTML += `
                        <div class = "seat-item" onclick = "xuanzuo(this) ">
                            <img src="../image/座位空.png" " style="width:100%;height:100%; "/>
                        </div>
                        `                   
                        div[num].setAttribute('data-seat',responseText.data[num].seat_id );
                        div[num].setAttribute('data-row',responseText.data[num].seat_row );
                        div[num].setAttribute('data-col',responseText.data[num].seat_col );
                        // div[num].setAttribute('data-img',responseText.data[num].seat_col );


                        console.log("seatid绑定成功！")


                        num = num + 1;
                    }
                    else if( responseText.data[num].seat_status == -1){
                        lala.innerHTML += `<div class = "seat-item" ></div>`
                        num = num + 1; 
                    }
                    else if( responseText.data[num].seat_status == 0){
                        lala.innerHTML += `<div class = "seat-item" ></div>`
                        num = num + 1;  
                    }
                }
                lala.innerHTML += '<br/>'      
            }

            // for(let k = 0 ; k < )


            piao = document.getElementById('ticket');
            piao.innerHTML ='';
            money = document.getElementById('zongjia');
            money.innerHTML ='总价';
		},

		fail: function(err) {
			alert("数据请求失败")
		}
    })

}



var str = new Array();
var str1 = new Array();


// 座位整体详情
function zuowei(planID){
    Ajax({
		url: "https://www.konghouy.cn/ttmsSale/ticketList",
		type: "GET",
		data: {id:planID},
		async: true,
		success: function(responseText) {  
            console.log('显示座位信息');    
            console.log(responseText);
            var outbox=document.getElementById('outbox2');
            console.dir(outbox);
        
            // outbox.setAttribute('data-danjia',responseText.dataAll[j].ticket_id)

            outbox.style.display = 'flex';
            a = document.getElementsByClassName('seat-item');
          
            var n = responseText.dataAll.length;  
            for( var i = 0 ; i < a.length ; i++){
                for(var j = 0 ; j < n ; j++){
                    if(responseText.dataAll[j].seat_id == a[i].dataset.seat){
                        a[i].setAttribute('data-ticket',responseText.dataAll[j].ticket_id)
                        console.log("ticket id 绑定成功")
                    }
                }
            }
        

            for( let q = 0 ; q < responseText.dataSale.length ; q++){
                for(let p = 0 ; p < a.length ; p++){
                    if(responseText.dataSale[q].ticket_id == a[p].dataset.ticket){
                        console.log(responseText.dataSale[q].ticket_id);
                        a[p].children[0].src ="../image/座位已选.png"
                        // console.log("座位选择了")
                        
                    }
                }
            }
           
		},

		fail: function(err) {
			alert("数据请求失败")
		}
    })
}   

function hh(e){
    console.log(e.children[0]);
}

function xuanzuo(e){
    // str = [];
    // str1 = [];
    console.log("所选票的全部信息:");
	console.log("lalalaal")
    var ticketitem=document.getElementById('ticket');
    var zongjia = document.getElementById('zongjia');
    var flag=0;
    if(e.children[0].src =="file:///D:/desktop/study/%E5%A4%A7%E4%BA%8C%E7%9A%84%E4%BD%9C%E4%B8%9A%E4%BB%AC/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/TTMS/%E6%98%9F%E4%BA%91/image/%E5%BA%A7%E4%BD%8D%E7%A9%BA.png"){
        e.children[0].src = "../image/座位选.png";
        ticketitem.innerHTML += `
        <div class = "ticket-item"  >
            <div class="infor">`+ e.dataset.row +`行`+ e.dataset.col +`列</div>
        </div>
        ` 
        // var a = e.dataset.ticket;
        flag=1;  //已选定
        var data = {
            flag:flag,
            e:e
        }
        str.push(data);
        // console.log("操作过的str[]:");
        str1.push(e.dataset.ticket);
        // console.log(str1);   
    }
    // 取消选择
    else if(e.children[0].src== "file:///D:/desktop/study/%E5%A4%A7%E4%BA%8C%E7%9A%84%E4%BD%9C%E4%B8%9A%E4%BB%AC/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/TTMS/%E6%98%9F%E4%BA%91/image/%E5%BA%A7%E4%BD%8D%E9%80%89.png"){
        e.children[0].src= "../image/座位空.png"; 
        for(var i = 0 ; i < str.length;i++){
            if( e.dataset.ticket == str[i].e.dataset.ticket){
                str[i].flag = 0;
            }
        }
        ticketitem.innerHTML = '';
        for(var i = 0 ; i < str.length ; i++){
            if(str[i].flag){
                ticketitem.innerHTML += `
                    <div class = "ticket-item"  >
                        <div class="infor">`+ str[i].e.dataset.row +`行`+ str[i].e.dataset.col +`列</div>
                    </div>
                    ` 
            }
        }
        str1 = [];
        console.log("取消选定str");
        console.log(str); 
        for( let k = 0; k < str.length ; k++){
            if(str[k].flag == 1)
            str1.push(str[k].e.dataset.ticket);

        }
        console.log("这是最终返回数组"); 
        console.log(str1); 
    }
    var jiage =document.getElementById('outbox2');  
    zongjia.innerHTML = "$"+str1.length* jiage.dataset.danjia;
}

function tijiao(){
    Ajax({
		url: "https://www.konghouy.cn/ttmsSale/sale",
		type: "POST",
		data: {ticket:str1},
		async: true,
		success: function(vic) { 
           alert("提交成功");
           console.log("提交的票的id是")
           console.log(str1);
		},
		fail: function(err) {
			alert("数据请求失败")
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


function ticketinfor(){
    ticketID = document.getElementById("txt2").value;
    console.log(ticketID)
    Ajax({
		url: "https://www.konghouy.cn/ttmsSale/ticketMessage",
		type: "GET",
		data: {id:ticketID},
		async: true,
		success: function(responseText) {
                   

            var date0 = new Date(responseText.data[0].plan_startime).format('yyyy-MM-dd  hh:mm')
            
            ticketroomname .innerHTML="影厅：" + responseText.data[0].room_name;
            ticketseatrow.innerHTML = "行号： " + responseText.data[0].seat_row
            ticketseatcol.innerHTML = "列号：" + responseText.data[0].seat_col;
            ticketplayname.innerHTML = "剧名：" + responseText.data[0].play_name;
            ticketstartime.innerHTML = "开始时间：" +date0;
            ticketmoney.innerHTML = "票价：" + responseText.data[0].plan_money;



            // 判断退票失败或者成功
            var vic = document.getElementById('vic');
            var def = document.getElementById('def');

            var time11 = responseText.data[0].plan_startime;
            var time12 = new Date(time11)
            var time = new Date();
            var time1 = time12.getTime();     
            var time2 = time.getTime();
            if(time1 >time2){
                def.style = 'block';
            }
            else{
                vic.style = 'block';
            }
		},
		fail: function(err) {
			alert("数据请求失败")
		}
    })
}


// 退票进程切换
var step=document.getElementById('step0');
var step1=document.getElementById('step1');
var step2=document.getElementById('step2');
var arrp=new Array();
arrp[0]=step;
arrp[1]=step1;
arrp[2]=step2;
function changep(n){
    var i;
    arrp[n].style.display = "none";

    arrp[n+1].style.display = "block";
}
    
function fanhui(){
    arrp[0].style.display = "block";
    arrp[2].style.display = "none";
}

// 销售记录
function financebyid(start,end,id){
    Ajax({
		url: "https://www.konghouy.cn/ttmsFinance/financebyid",
		type: "GET",
		data: {id:start,end},
		async: true,
		success: function(responseText) { 
              
            var n=responseText.data.length;

            console.log('显示个人销售信息');
            console.log(responseText);
            var finance = document.getElementById("xiaoshou-con");
            finance.innerHTML = "";
            for(let i = 0 ; i < n; i++ ){                 
                if (responseText.style == 0) {
                    finance.innerHTML +=
                `
                    <div class="title-item0" id="title-item1" >`+ responseText.data[i].ticket_id + `</div>
                    <div class="title-item0" id="title-item2" >`+ responseText.data[i].sale_status + `</div>
                    <div class="title-item0" id="title-item3" >`+ responseText.data[i].sale_money + `</div>
                    <div class="title-item0" id="title-item4" >`+ responseText.data[i].sale_time;+` </div>
    
                `
                }
            }           
		},
		fail: function(err) {
			alert("数据请求失败")
		}
    })
}





function  chaxun(){
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
			
			for(var i=0;i<responseText.data.length;i++){
				var tr=document.createElement('tr');
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_id']));
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(new Date(responseText.data[i]['sale_time']).format('yyyy-MM-ss hh:mm')));
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_money']));
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['ticket_id']));
				tr.appendChild(td);
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(responseText.data[i]['sale_status']));
				tr.appendChild(td);
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
		},
		fail: function(err) {
		}
	})
}
