var houseJobsPage = {
	redrawJobsTables: function(upcomingJobs,pastDueJobs){
		$("#pastJobs").find('.clean-box').remove();
		$("#futureJobs").find('.clean-box').remove();
		for(var i=0;i<upcomingJobs.length;i++){
			var htmlString = "<tr class='clean-box'><td>"+upcomingJobs[i].Description+"</td><td>"+upcomingJobs[i].Crew.Description+"</td><td>"+moment(upcomingJobs[i].DueDate).format('ddd MMM DD hh:mm A')+"</td></tr>"
			$("#futureJobs").append(htmlString);	
		}
		for(var i=0;i<pastDueJobs.length;i++){
			var htmlString = "<tr class='clean-box'><td>"+pastDueJobs[i].Description+"</td><td>"+pastDueJobs[i].Crew.Description+"</td><td>"+moment(pastDueJobs[i].DueDate).format('ddd MMM DD hh:mm A')+"</td></tr>"
			$("#pastJobs").append(htmlString);
		}


	},
	filterByCleaner: function(){
		$("#loading-overlay").show()
		cleanerId = $("#cleanerDropdown").val();
		if (cleanerId=="clear"){
			window.location.replace('/')
		}
		else{
			$.post('/getJobsByCleanerId',{cleanerId:cleanerId},function(data){
				console.log(data);
				if (data.success){
					houseJobsPage.redrawJobsTables(data.upcomingJobs,data.pastDueJobs);
					$("#loading-overlay").hide()
				}
			})	
		}	
	}

};
$(document).ready(function(){
	$("#loading-overlay").show()
	$('.clean-box').click(function(){
		var cleanId = $(this).find('.id-holder').text();
		console.log(cleanId);
		window.location.replace("/cleanDetails/"+cleanId)
	});
	$('.description-column').hover(
		function(){
			$(this).find('.crew-description').hide();
			$(this).find('.crew-details').show();
			console.log('show')
		}, 
		function(){
			$(this).find('.crew-description').show();
			$(this).find('.crew-details').hide();
			console.log('hide');
		})
	$("#loading-overlay").hide()
})