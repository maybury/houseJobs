var checkoffPage ={
	ConfirmCheckoff : function(id){
		$.post("/manage/ConfirmCheckoff",{
			cleanId:id
		},function(){
			window.location.replace('/manage/cleans')
		})
	},
	DenyCheckoff: function(id){
		$.post("manage/DenyCheckoff",{
			cleanId:id
		},
		function(){
			window.location.replace('manage/cleans')
		})
	}
}
$(document).ready(function(){
	$(".confirm").click(function(){
		var id = $(this).closest('tr').find('.id-holder').text();
		checkoffPage.ConfirmCheckoff(id);
	})
	$(".deny").click(function(){
		var id = $(this).closest('tr').find('.id-holder').text();
		checkoffPage.DenyCheckoff(id);
	})
	$(".crew-description").hover(function(){
		$(this).hide();
		$(this).siblings('.crew-list').show();
	})
	$(".crew-list").mouseout(function(){
		$(this).hide();
		$(this).siblings('.crew-description').show();
	})
})