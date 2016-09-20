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

//点击send
    // $(".send").click(function(ev) {
    //     var target =ev.target || window.event.srcElement;
    //     var id = target.parentElement.id;
    //     window.location.href="/viewSheet/"+id;
    // })

//ajax动态加载时点击send事件
    // var body = $(document.body);
    // body.click(function(ev){
    //     var ev = ev || window.event;
    //     var target = ev.target || ev.srcElement;
    //     if(target.className=="type"||target.className=="type typeRight"){
    //         window.location.href="/viewSheet";
    //     }
    // });
    var playBtn = $('.playBtn');
    var pauseBtn = $('.pauseBtn');
    var player = document.getElementById("player");
    playBtn.click(function(e) {
        var clicked = $('.clicked')
        clicked.css("display","inline");
        clicked.next().css("display","none");
        clicked.removeClass("clicked");
        var target = $(e.target);
        var sessionid = target.data('id');
        target.addClass("clicked");
        $.ajax ({
            type: 'post',
            url: '/record/' + sessionid
        })
        .done(function(results) {
            if(results.success === 1) {
                player.src=results.recordUrl;
                target.css("display","none");
                target.next().css("display","inline");
            }else if(results.success === 0) {
                target.attr('src',"/img/stop.png");
            }
        })
    })
    pauseBtn.click(function(e) {
        var target = $(e.target);
        if(player.paused) {
            player.play();
            target.attr('src',"/img/pause.jpg");
        }else {
            player.pause();
            target.attr('src',"/img/play.jpg");
        }
    })

});

