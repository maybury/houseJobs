var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Task = require('../models/TaskSingleton.js');
var CleanTask = require('../models/Task.js');
var Clean = require('../models/Clean.js');
var Cleaner = require('../models/Cleaner.js');
var Crew = require('../models/Crew.js');
var moment = require('moment');
var Util = require('../public/javascripts/util.js');
var Session = require('../models/Session.js');
var CleanStatus = require('../models/CleanStatus.js');
var role = require('../models/Role.js')
var code = "pass1"

var mongoose = require('mongoose');


/* GET home page. */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
router.get('/',function(req,res){
	if (req.cookies.s!=null){
		Util.CheckSessionValidity(req.cookies.s,function(result){
			if (result==true){
				res.redirect('/manage/cleans');
				return;
			}
			res.render('manage',{title: 'ZP House Jobs | Manage'});
			return;

		})
	}
	else{
		res.render('manage',{title: 'ZP House Jobs | Manage'})
		return;
	}
})
router.get('/tasks', function(req, res) {
	if (req.cookies.s!=null){
		Util.CheckSessionValidity(req.cookies.s,function(result){
			Task.find({}).exec(function(err,CleanerTasks){
  				res.render('manageTasks', { title: 'Manage Tasks', tasks:CleanerTasks });
  				return;
			});
		});
	}
	else{
		res.redirect('/manage');
		return;
	}

});
router.post('/identify',function(req,res){
	if (req.body.Id==code){
		var thisSession = new Session({});
		thisSession.save(function(err,session){
			if (err==null){
				res.send({success:true,s:session._id})
				return;
			}
			else{
				console.log(err);
			}	
		})
	}
	else{
		res.redirect('/')
	}
})
router.post('/addTask', function(req,res){
	var newTask = new Task();
	newTask.Description = req.body.description;
	console.log(req.body.description);
	newTask.save(function(err,task){
		if (err==null){
			res.send({success :true})
			return;
		}
	})
});
router.post('/deleteClean',function(req,res){
	Clean.remove({_id:req.body.Clean},function(err){
		if (err==null){
			res.send({success:true});
		}
	})
})
router.post('/addClean',function(req,res){
	var newClean = new Clean();
	newClean.Description = req.body.Description;
	newClean.Crew = null;
	newClean.Tasks = [];
	newClean.DueDate = req.body.DueDate;
	newClean.FineDate = req.body.FineDate;
	newClean.CheckedOff=false;
	newClean.CleanersToCheckoff = [];
	newClean.FineAmount = req.body.FineAmount;
	newClean.Fined = false;
	newClean.Status = CleanStatus.Upcoming;
	newClean.save(function(err,clean){
		if (err==null){
			
			res.send({success:true});
			return;
		}
	})
});
router.post('/addTaskToClean',function(req,res){
	var newTask = new CleanTask();
	Task.findOne({_id:req.body.Task},function(err,taskBase){
		newTask.Base = taskBase._id;
		newTask.BaseId = taskBase._id;
		newTask.Description = taskBase.Description;
		newTask.Completed = false;
		newTask.save(function(err,newTask){
			Clean.findOne({_id:req.body.Clean}).populate('Tasks').exec(function(err,editedClean){
				var taskInClean = false;
				for(var i=0;i<editedClean.Tasks.length;i++){
					console.log(editedClean.Tasks[i].BaseId)
					console.log(newTask.BaseId)
					console.log(editedClean.Tasks[i].BaseId.equals(newTask.BaseId))
					if (editedClean.Tasks[i].BaseId.equals(newTask.BaseId)){
						taskInClean= true;
					}
				}
				console.log(taskInClean);
				if(!taskInClean){
					editedClean.Tasks.push(newTask._id);
					editedClean.save(function(err,editedClean){
						if (err==null){
							res.send({success:true});
							return;
						}
					})
				}
			})
		})
	})
})
router.post('/addCrewToClean',function(req,res){
	Crew.findOne({_id:req.body.Crew}).populate('Cleaners').exec(function(err,crewAssigned){
		Clean.findOne({_id:req.body.Clean},function(err,editedClean){
			if(editedClean.Crew==null){
				editedClean.Crew = crewAssigned._id;
				for(var i=0;i<crewAssigned.Cleaners.length;i++){
					editedClean.CleanersToCheckoff.push(crewAssigned.Cleaners[i]);
				}
				editedClean.save(function(err,editedClean){
					if (err==null){
						Util.SetupPreReminderEmail(editedClean._id);
						Util.SetupDueReminderEmail(editedClean._id);
						Util.SetupFineEmail(editedClean._id);
						res.send({success:true});
						return;
					}
				})	
			}
			
		})
	})
})
router.post('/getTasksList', function(req,res){
	Task.find({}).exec(function(err, CleanerTasks){
		res.send({
			tasks:CleanerTasks
		});
		return;
	});

});
router.post('/deleteTask',function(req,res){
	Task.remove({_id:req.body.id}).exec(function(err){
		if (err==null){
			res.json({
				success:true
			});
			return;
		}
	})
});
router.post('/deleteCleaner',function(req,res){
	Cleaner.remove({_id:req.body.id}).exec(function(err){
		if(err==null){
			res.json({
				success:true
			});
			return;
		}
	})
});
router.post('/deleteCrew',function(req,res){
	Crew.remove({_id:req.body.id}).exec(function(err){
		if (err==null){
			res.json({
				success:true
			});
			return;
		}
	})
})
router.post('/assignCleaner',function(req,res){
	Cleaner.findOne({Name:req.body.cleaner},function(err,cleaner){
		Crew.findOne({_id:req.body.crew},function(err,crew){
			if (err==null){
				console.log(crew.Cleaners)
				if (crew.Cleaners!=null){
					if (crew.Cleaners.indexOf(cleaner._id)==-1){
						crew.Cleaners.push(cleaner._id);
					}
				}
				else{
					crew.Cleaners = [cleaner._id];
				}
				crew.save(function(err){
					if (err==null){
						res.json({success:true});
						return;
					}
					else{
						res.json({success:false,error:err});
						return;
					}
				})
			}
			else{
				res.json({success:false,error:err});
				return;
			}

		})
	})
})
router.post('/addCleaner', function(req,res){
	var newCleaner = new Cleaner();
	newCleaner.Name = req.body.Name;
	newCleaner.Email = req.body.Email;
	newCleaner.Role = req.body.Role;
	console.log(newCleaner);
	newCleaner.save(function(err,task){
		if (err==null){
			res.send({success :true})
			return;
		}
		else(console.log(err))
	})
});
router.post('/addCrew',function(req,res){
	var newCrew = new Crew();
	newCrew.Description = req.body.Name;
	newCrew.Cleaners = [];
	newCrew.save(function(err){
		if (err==null){
			res.json({
				success:true
			});
			return;
		}
	})
})
router.post('/ConfirmCheckoff',function(req,res){
	Clean.findOne({_id:req.body.cleanId}).exec(function(err,clean){
		clean.Status = CleanStatus.CheckedOff;
		clean.CleanersToCheckoff = [];
		clean.save(function(err){
			if (err==null){
				Util.SendCheckoffConfirmationEmail(clean._id)
				res.send({success:true})
			}
		})
	})
})
router.post('/CheckoffCleaner',function(req,res){
	Clean.findOne({_id:req.body.cleanId}).exec(function(err,clean){
		var index = clean.CleanersToCheckoff.indexOf(req.body.cleanerId);
		clean.CleanersToCheckoff.splice(index,1);
		clean.save(function(err){
			if(err==null){
				res.send({success:true});
			}
		})
	})
})
router.post('/DenyCheckoff',function(req,res){
	Clean.findOne({_id:req.body.cleanId}).populate('Crew').exec(function(err,clean){
		clean.Status = CleanStatus.Incomplete;
		clean.CleanersToCheckoff = clean.Crew.Cleaners;
		clean.save(function(err){
			if (err==null){
				res.send({success:true})
			}
		})
	})
})
router.get('/cleans', function(req, res) {
	if (req.cookies.s!=null){
		Util.CheckSessionValidity(req.cookies.s,function(result){
			Task.find({}).exec(function(err, Tasks){
				Crew.find({}).exec(function(err,Crews){
					var currentTime = Date.now()
					console.log(currentTime);
					Clean.find({Status:CleanStatus.Upcoming}).populate('Crew','Description').populate('Tasks').populate('CleanersToCheckoff').exec(function(err,Cleans){
						if(err==null){
							res.render('manageCleans', { title: 'Manage Cleans', crews:Crews, tasks:Tasks, upcomingCleans:Cleans, moment:moment});
						}
						else{
							console.log(err);
						}
					});
				})
			})
		})
	}
	else{
		res.redirect('/manage')
	}
});
router.get('/checkoff',function(req,res){
	if (req.cookies.s!=null){
		Clean.find({}).populate('Crew').populate('Tasks').populate('CleanersToCheckoff').exec(function(err,cleans){
			Crew.populate(cleans.Crew,{path:'Cleaners'},function(err,thisCrew){
				CleanTask.populate(cleans.Tasks,{path:'Tasks'},function(err,theseTasks){
					Util.CheckSessionValidity(req.cookies.s,function(result){
						res.render('checkoff', { title: 'Checkoff', jobs: cleans,moment:moment, role:role });
						return;
					})
				})
			});
		})
	}
	else{
		res.redirect('/manage');
		return;
	}
})
router.get('/cleaners', function(req, res) {
	if (req.cookies.s!=null){
		Util.CheckSessionValidity(req.cookies.s,function(result){
			Cleaner.find({}).exec(function(err,Cleaners){
				res.render('manageCleaners', { title: 'Manage Cleaners', cleaners: Cleaners });
				return;
			})
		})
	}
	else{
		res.redirect('/manage')
	}  
});
router.get('/crews', function(req, res) {
	if (req.cookies.s!=null){
		Util.CheckSessionValidity(req.cookies.s,function(result){
			Crew.find({}).populate('Cleaners','Name').exec(function(err,Crews){
				var cleanerNames = []
				for (var i =0;i<Crews.length;i++){
					var crewCleaners = Crews[i].Cleaners;
					cleanerNames.push(crewCleaners);
					console.log(crewCleaners);
					
				}
				console.log(cleanerNames);

				if(err==null){
					Cleaner.find({}).exec(function(err,Cleaners){

					res.render('manageCrews', { title: 'Manage Crews', crews: Crews, cleaners:Cleaners, cleanerNames:cleanerNames});
					})
				}
			});
		})
	}
	else{
		res.redirect('/manage')
	}
});
module.exports = router;
