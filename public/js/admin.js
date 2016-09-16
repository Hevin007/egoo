$(function() {
	$('.record').click(function(e) {
		var target = $(e.target)
		var sessionid = target.data('id')
		$.ajax ({
			type: 'post',
			url: '/record/' + sessionid
		})
		.done(function(results) {
			if(results.success === 1) {
				alert(results.recordUrl)
			}
		})
	})
})