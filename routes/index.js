var express = require('express');
var router = express.Router();
var util = require('../public/javascripts/util.js')
var Clean = require('../models/Clean.js');
var Cleaner = require('../models/Cleaner.js');
var Crew = require('../models/Crew.js');
var moment = require('moment');
var Task = require('../models/Task.js');
var CleanStatus = require('../models/CleanStatus.js')
var nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res) {
	var now = moment(Date.Now).unix()*1000;
	Cleaner.find({}).exec(function(err,cleaners){
		Clean.find({}).populate('Crew').populate('CleanersToCheckoff').exec(function(err,cleans){
			Crew.populate(cleans.Crew,{path:'Cleaners'},function(err,thisCrew){
				if(err==null){
					console.log(cleans[0])
					console.log(thisCrew)
					res.render('index', { title: 'House Jobs', moment:moment,jobs:cleans,cleaners:cleaners });
					return;
				}
				else{
					console.log(error)
				}
			})
		})
	});
});
router.post('/getJobsByCleanerId',function(req,res){
	var now = moment(Date.Now).unix()*1000;
	Crew.findOne({Cleaners:{$in:[req.body.cleanerId]}}).exec(function(err,crew){
		Clean.find({Crew:crew, DueDate:{$gt:now}}).populate('Crew').populate('Cleaners').exec(function(err,upcomingJobs){
			Clean.find({Crew:crew, DueDate:{$lt:now},CheckedOff:false}).populate('Crew').populate('Cleaners').exec(function(err,pastDueJobs){
				if(err==null){
					res.send({success:true, upcomingJobs:upcomingJobs, pastDueJobs:pastDueJobs});
					return;
				}
				else{
					res.send({success:false});
				}
			})
		})
	});
})
router.post('/toggleTaskCompleted',function(req,res){
	Task.findOne({_id:req.body.Task}).exec(function(err,currentTask){
		currentTask.Completed = req.body.Completed;
		console.log(req.body.Completed)
		currentTask.save(function(err,task){
			if (err==null){
				res.send({success:true});
				return;
			}
		})
	})
})
router.post('/requestCheckoff',function(req,res){
	Clean.findOne({_id:req.body.cleanId}).exec(function(err,thisClean){
		if (err==null){
			thisClean.Status=CleanStatus.CheckoffRequested;
			var transporter = nodemailer.createTransport({
    			service: 'gmail',
    			auth: {
        			user: 'ZPHouseJobs@gmail.com',
        			pass: 'TheSuperIsMe'
    			}
    		})
    		var mailOptions = {
			    from: 'Zeta Psi Superintendent <ZPHouseJobs@gmail.com>', // sender address
			    to: 'Max Maybury <maxmaybury0509@gmail.com>', // list of receivers
			    subject: 'Request To Check Off House Job', // Subject line
			    text: '', // plaintext body
			    html: '<b>Please Check off</b> '+thisClean.Description +'<a href="/manage/checkoff">Visit the site</a>' // html body
			};
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			        thisClean.save(function(err){
			        	if (err==null){
			        		res.send({success:true});
			        		return;
			        	}
			        })
			    }
			});
		}
	})
})
router.get('/cleanDetails/*',function(req,res){
	var cleanId = req.params[0];
	Clean.findOne({_id:cleanId}).populate('Crew').populate('Tasks').exec(function(err,thisClean){
		Crew.populate(thisClean.Crew,{path:'Cleaners'},function(err,thisCrew){
		if(err==null && thisClean!=null){
			console.log(thisClean);
			res.render('cleanDetails',{
				title: 'House Jobs | Clean Details',
				clean:thisClean,
				moment:moment
			});
			return;
		}
		})

	})
})
router.get('/overview', function(req,res){
	Clean.find({Status:{$in:[CleanStatus.Upcoming,CleanStatus.Reminded]}}).populate('Crew').populate('CleanersToCheckoff').exec(function(err,cleans){
		res.render('overview', {title: 'weekly overview',moment:moment, cleans:cleans});
		return;
	})
})
module.exports = router;
