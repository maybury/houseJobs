manageCrewsPage = {
	addCrew : function(){
		var name = $("#description").val()
		$.post('/manage/addCrew',{Name:name},function(data){
			window.location.replace('/manage/crews');
		})
	},
	deleteCrew : function(object){
		console.log("delete");
		console.log(object);
		var description = $(object).siblings('.id-holder').text();
		console.log(description);
		$.post('/manage/deleteCrew',
		{
			id : description
		},
		function(data){
			window.location.replace('/manage/crews');
		});
	},
	removeCleaner :function(object){
		var crewId = $(object).closest('tr').find('.id-holder').text().trim();
		var cleanerId = $(object).closest('.crew-cleaner').find('.cleaner-id').text().trim();
		console.log(crewId);
		console.log(cleanerId);
		$.post('/manage/removeCleanerFromCrew',
		{
			crewId:crewId,
			cleanerId:cleanerId
		},function(){
			window.location.replace('/manage/crews');
		});
	},
	focusCleaner : function(object){
		console.log(object);
		$('.cleaner-box').removeClass('selected');
		$(object).addClass('selected');
		$('.cleaners-column').addClass('selected-column')
		return;
	},
	assignCleaner : function(object){
		if ($(object).hasClass('selected-column')){
			var crewId = $(object).closest('tr').find('.id-holder').text();
			var cleanerName = $('.selected').text().trim();
			console.log(cleanerName)
			$.post('/manage/assignCleaner',
				{crew:crewId, cleaner:cleanerName}
				,function(data){
					if (data.success){
						window.location.replace('/manage/crews')
					}
					else{
						console.log(data.error);
					}
				})
		}
	}

};
$(document).ready(function(){
});