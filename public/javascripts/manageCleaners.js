manageCleanersPage = {
	addCleaner : function(){
		var name = $("#nameEntry").val();
		var email = $("#emailEntry").val();
		console.log(email);
		$.post('/manage/addCleaner',{Name:name, Email:email},function(data){
			window.location.replace('/manage/Cleaners');
		})
	},
	deleteCleaner : function(object){
		console.log("delete");
		console.log(object);
		var description = $(object).closest('tr').find('.id-holder').text();
		console.log(description);
		$.post('/manage/deleteCleaner',
		{
			id : description
		},
		function(data){
			window.location.replace('/manage/cleaners');
		});
	}
};
$(document).ready(function(){
	console.log('hello world!');
});