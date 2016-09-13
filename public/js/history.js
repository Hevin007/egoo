/**
 * Created by Hevin on 2016/4/19.
 */

//window.location.reload(true);
$(document).ready(function () {
    var d = new Date();
    var year = d.getFullYear();

    $(".start").innerHTML = year;

    readHistorty();
    $(".btnAdd").click(addWorkSheet);

    var body = $(document.body);
    body.click(function(ev){
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        if(target.className=="type"||target.className=="type typeRight"){
            window.location.replace("http://localhost/egoo/viewSheet.html");
        }
    });
});

function createSend(myTime,myType) {

    var map = {
        sendL: 'send',
        sendR: 'send sendRight',
        timeL: 'time',
        timeR: 'time timeRight',
        arrowL: 'arrow',
        arrowR: 'arrow arrowRight',
        dotL: 'dot',
        dotR: 'dot dotRight',
        typeL: 'type',
        typeR: 'type typeRight'

    }

    var direction = 'R';
    if ($(".btn").next().hasClass("sendRight")) {
        direction = 'L';
    }
    var newSend = $("<div></div>");
    var color = getRandomColor();
    newSend.addClass(map['send' + direction]);
    newSend.css("background-color", color);
    var newTime = $("<div></div>");
    newTime.addClass(map['time' + direction]);
    newTime.html(myTime);
    var newArrow = $("<div></div>");
    newArrow.addClass(map['arrow' + direction]);
    switch (direction) {
        case 'L':
            newArrow.css("border-color",
                    " transparent transparent transparent " + color);
            break;
        case 'R':
            newArrow.css("border-color", " transparent " + color + " transparent transparent ");
            break;
    }

    var newDot = $("<div></div>");
    newDot.addClass(map['dot' + direction]);
    newDot.css("background-color", color);
    var newType = $("<div></div>");
    newType.addClass(map['type' + direction]);
    newType.html(myType);


    newSend.append(newTime, newArrow, newDot, newType);

    $(".btn").after(newSend);
    $(".midLine").height($(document).height());

}

function readHistorty(){

    var tId = "admin";
    var aId = "admin";
    var uId = "admin";

    try
    {
        tId = myAndroid.getTenantId();
        aId = myAndroid.getAgentId();
        uId = myAndroid.getUserId();
    }catch (e){

    }



    var  getval = {

        read: "readHistory",
        tenantid : tId,
        agentid: aId,
        userid: uId

    };


    $.get("server.php",getval,function(data){
        //向服务器发送请求，返回工单历史信息
        alert(data.length);
        for(var i=0;i<data.length;i++) {
            createSend(data[i]["time"],data[i]["label"]);
        }

    });
}


function addWorkSheet() {

    window.location.href="/workSheet";

}

function getRandomColor() {
    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}