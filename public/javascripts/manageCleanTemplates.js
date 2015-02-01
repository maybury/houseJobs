var templatePage = {
	addTemplate : function(){
		var templateDescription = $("#templateDescription").val()
		if (templateDescription!=null&&templateDescription!=''){
			$.post('/manage/addTemplate',{
				description: templateDescription
			},
			function(){
				window.location.replace('/manage/cleanTemplates');
			});
		}
		
	},
	focusTask : function(element){
		console.log('focus');
		console.log(element)
		$('.task-holder').removeClass('selected-task');
		$(element).addClass('selected-task');
		$('.template-holder').addClass('selected-template');
		var taskId = $(element).find('.id-holder').text()
		$('.selected-template').click(function(){
			var templateId = $(this).closest('tr').find('.id-holder').text()
			templatePage.addTemplateTask(templateId,taskId);
		})
	},
	addTemplateTask : function(templateId,taskId){
		$.post('/manage/addTemplateTask',{
			templateId: templateId,
			taskId: taskId
		},
		function(){
			window.location.replace('/manage/cleanTemplates');
		})
	}

}
