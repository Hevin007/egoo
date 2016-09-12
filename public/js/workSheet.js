/**
 * Created by Hevin on 2016/3/29.
 */







$(document).ready(function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var date = ("0" + d.getDate()).slice(-2);
    var t = d.toLocaleTimeString();
    document.getElementById("time").innerHTML = "工单时间：" + year + "年" + month + "月" + date + "日" + t;

    $("#btnSub").click(function () {

        var tId = "admin";
        var aId = "admin";
        var uId = "admin";
        var sId = "admin";

        try {
            tId = window.myAndroid.getTenantId();
            aId = window.myAndroid.getAgentId();
            uId = window.myAndroid.getUserId();
            sId = window.myAndroid.getSessionId();
        } catch (e) {
        }

        var getval = {

            tenantid: tId,
            agentid: aId,
            userid: uId,
            sessionid: sId,
            time: month + date,
            label: $("#group").find("option:selected").attr("value")
                + ":" + $("#type").find("option:selected").attr("value"),
            remark: $("#moreInfo").attr("value")

        };

        $.get("server.php", getval
//            {
//            time: month+date,
//            type: $("#type").find("option:selected").attr("value"),
//            group: $("#group").find("option:selected").attr("value")}
            , function (data) {

                if (data == "insert succeed!") {

                    try {
                        window.myAndroid.ToChat();
                    } catch (e) {
                    }

                    window.location.replace("http://localhost/egoo/history.html");


                }


            });


    });


});



