var manageTasksPage = {
	addTask : function(){
		var task = $("#description").val();
		console.log(task);
		$.post('/manage/addTask',{description:task},function(data){
			window.location.replace('/manage/tasks')
		})
	},
	deleteTask : function(object){
		console.log("delete");
		console.log(object);
		var description = $(object).siblings('.id-holder').text();
		console.log(description);
		$.post('/manage/deleteTask',
		{
			id : description
		},
		function(data){
			window.location.replace('/manage/tasks');
		});
	}
};
$(document).ready(function(){
	console.log('hello world!');
});