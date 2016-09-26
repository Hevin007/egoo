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

	$('.del').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax ({
			type: 'DELETE',
			url: '/admin/workSheet/list?id=' + id
		})
		.done(function(results) {
			if(results.success === 1) {
				if(tr.length > 0) {
					tr.remove()
				}
			}
		})
	})
})