/**
 * Created by Hevin on 2016/4/19.
 */

//window.location.reload(true);
$(document).ready(function () {
    var d = new Date();
    var year = d.getFullYear();

    $(".start").innerHTML = year;
    $(".midLine").height($(document).height());
    // $(".btnAdd").click(addWorkSheet);

    var body = $(document.body);
    body.click(function(ev){
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        if(target.className=="type"||target.className=="type typeRight"){
            // window.location.href="/viewSheet.html";
        }
    });
});

function addWorkSheet() {

    window.location.href="/workSheet";

}
