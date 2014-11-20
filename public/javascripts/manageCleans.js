
var manageCleansPage ={
	addClean : function(){
		var description = $("#description").val();
		var dueDate = moment($("#dueDate").val()).unix()*1000;
		var fineDate = moment($("#fineDate").val()).unix()*1000;
		var fineAmount = $("#fineAmount").val();
		
		$.post('/manage/addClean',{
			Description: description,
			DueDate : dueDate,
			FineDate : fineDate,
			FineAmount : fineAmount
		},function(data){
			if (data.success){
				window.location.replace('/manage/cleans');
			}
		})

	},
	deleteClean: function(object){
		var cleanId = $(object).closest('tr').find('.id-holder').text();
		$.post('/manage/deleteClean',{Clean:cleanId},function(data){
			if (data.success){
				window.location.replace('/manage/cleans');
			}
		})
	},
	applyListeners: function(){
		$(".task-holder").click(function(){
			var taskId = $(this).find('.id-holder').text();
			$('.task-holder').removeClass('selected-task');
			$('.crew-holder').removeClass('selected-crew');
			$(this).addClass('selected-task');
			$('.task-column').addClass('assign-task-column');
			$('.crew-column').removeClass('assign-crew-column');
			manageCleansPage.applyListeners();
		});
		$(".crew-holder").click(function(){
			var crewId = $(this).closest('tr').find('.id-holder').text();
			$('.crew-holder').removeClass('selected-crew');
			$('.task-holder').removeClass('selected-task');
			$(this).addClass('selected-crew');
			$('.task-column').removeClass('assign-task-column');
			$('.crew-column').addClass('assign-crew-column')
			manageCleansPage.applyListeners();
		});
		$('.assign-task-column').click(function(){
			var cleanId = $(this).closest('tr').find('.id-holder').text();
			var taskId = $(".selected-task").find('.id-holder').text();
			$.post('/manage/addTaskToClean',{
				Clean: cleanId,
				Task: taskId
			},function(data){
				if (data.success){
					window.location.replace('/manage/cleans')
				}
			})
		});
		$('.assign-crew-column').click(function(){
			var cleanId = $(this).closest('tr').find('.id-holder').text();
			var crewId = $(".selected-crew").find('.id-holder').text();
			console.log(cleanId);
			$.post('/manage/addCrewToClean',{
				Clean: cleanId,
				Crew: crewId
			},function(data){
				if (data.success){
					window.location.replace('/manage/cleans')
				}
			})
		})
	}
}
$(document).ready(function(){
	$("#dueDate").val(moment(Date.now()).format('MM/DD/YY hh:mm A'));
	$("#fineDate").val(moment(Date.now()).format('MM/DD/YY hh:mm A'));
	manageCleansPage.applyListeners();
})