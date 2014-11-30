var CleanDetailsPage ={
	toggleTaskCompleted : function(TaskId, value){
		$.post('/toggleTaskCompleted',{
			Task:TaskId,
			Completed:value
		},function(data){
		})
	},
	requestCheckoff: function(){
		var cleanId= $(".clean-id").text()
		$.post('/requestCheckoff',{
			cleanId:cleanId
		},function(data){
			if (data.success){
				window.location.replace('/cleanDetails/'+cleanId);
			}
		})
	}
}
$(document).ready(function(){
	$('.clean-task-checkbox').click(function(){
		var taskId = $(this).siblings('.id-holder').text();
		var newValue = ($(this).prop('checked'));
		console.log(newValue);
		CleanDetailsPage.toggleTaskCompleted(taskId,newValue)
	})
})