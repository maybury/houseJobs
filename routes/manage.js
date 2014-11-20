var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Task = require('../models/TaskSingleton.js');
var CleanTask = require('../models/Task.js');
var Clean = require('../models/Clean.js');
var Cleaner = require('../models/Cleaner.js');
var Crew = require('../models/Crew.js');
var moment = require('moment');
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

router.get('/tasks', function(req, res) {
	Task.find({}).exec(function(err,CleanerTasks){
  		res.render('manageTasks', { title: 'Manage Tasks', tasks:CleanerTasks });
	});
});
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
	newClean.FineAmount = req.body.FineAmount
	newClean.Fined = false;
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
		newTask.Description = taskBase.Description;
		newTask.save(function(err,newTask){
			Clean.findOne({_id:req.body.Clean},function(err,editedClean){
				editedClean.Tasks.push(newTask._id);
				editedClean.save(function(err,editedClean){
					if (err==null){
						res.send({success:true});
						return;
					}
				})
			})
		})
	})
})
router.post('/addCrewToClean',function(req,res){
	Crew.findOne({id:req.body.Task},function(err,crewAssigned){
		Clean.findOne({_id:req.body.Clean},function(err,editedClean){
			editedClean.Crew = crewAssigned._id;
			editedClean.save(function(err,editedClean){
				if (err==null){
					res.send({success:true});
					return;
				}
			})
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
					console.log(cleaner._id);
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
	console.log(req.body.description);
	newCleaner.save(function(err,task){
		if (err==null){
			res.send({success :true})
			return;
		}
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
router.get('/cleans', function(req, res) {
	Task.find({}).exec(function(err, Tasks){
		Crew.find({}).exec(function(err,Crews){
			var currentTime = Date.now()
			console.log(currentTime);
			Clean.find({DueDate:{$gt:currentTime}}).populate('Crew','Description').populate('Tasks').exec(function(err,Cleans){
				if(err==null){
					res.render('manageCleans', { title: 'Manage Cleans', crews:Crews, tasks:Tasks, upcomingCleans:Cleans, moment:moment});
				}
				else{
					console.log(err);
				}
			});
		})
	})
 
});

router.get('/cleaners', function(req, res) {
	Cleaner.find({}).exec(function(err,Cleaners){
		res.render('manageCleaners', { title: 'Manage Cleaners', cleaners: Cleaners });
		return;
	})  
});
router.get('/crews', function(req, res) {
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
});
module.exports = router;
