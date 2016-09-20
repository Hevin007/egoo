/**
 * Created by Hevin on 2016/3/29.
 */

function check() {
    var busType=$("#busType").val();
    var busGroup=$("#busGroup").val();
    if(busType=='') {
        $(".errorType").css("visibility","visible");
    }else {
        $(".errorType").css("visibility","hidden");
    }
    if(busGroup=='') {
        $(".errorGroup").css("visibility","visible");
    }else {
        $(".errorGroup").css("visibility","hidden");
    }
    if(busType==''||busGroup=='') {
        return false;
    }
    return true;
    
}
$(document).ready(function () {

});
