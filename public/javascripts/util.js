var hashmult = 6782;
var hashshift = 82834;
var Session = require('../../models/Session.js');
var Clean = require('../../models/Clean.js');
var Crew = require('../../models/Crew.js');
var Cleaner = require('../../models/Cleaner.js')
var Role = require('../../models/Role.js')
var moment = require('moment');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var CleanStatus=require('../../models/CleanStatus.js')

var util = module.exports={

	GetHashedPassword: function(password)
	{
		var newPassword='';
		for(var i=0;i<password.length;i++)
		{
			newPassword+=(password.charCodeAt(i)+100).toString();
		}
		var intPassword = parseInt(newPassword);
		finalPassword = ((intPassword*hashmult)+hashshift).toString();
		return newPassword;
	},
	CheckSessionValidity: function(sessionId, f){
		var currentSession;
		console.log('session: ' +sessionId)
		Session.findOne({ _id: sessionId }, 
			function (err, currentSession) {
			    if (err) {
			        throw Error;
			    }
			    if(currentSession!=null){
			    	
			    	return f(false);
			    	
			    }
			    return f(false);
			}
		);
	},
	sendReminderEmail: function(scheduler, crew,clean){
		console.log(clean);

	},
	SetupPreReminderEmail: function(cleanId){
		Clean.findOne({_id:cleanId}).populate('Crew').exec(function(err,clean){
			Crew.populate(clean.Crew,{path:'Cleaners'},function(err,thisCrew){
				var reminderDate = new Date(clean.DueDate-(1000*60*60*24*3));
				var reminder = schedule.scheduleJob(reminderDate,function(){
					console.log('task succeeded!');
					
					if(clean!=null&&thisCrew!=null){
						Crew.findOne({_id:thisCrew._id}).populate('Cleaners').exec(function(err, thisCrew){
							var emailList = '';
							for(var i=0; i<thisCrew.Cleaners.length;i++){
								emailList+=thisCrew.Cleaners[i].Name+' <'+thisCrew.Cleaners[i].Email+'>, '
							}
							console.log(emailList);
							var transporter = nodemailer.createTransport({
								service: 'gmail',
								auth: {
					    			user: 'ZPHouseJobs@gmail.com',
					    			pass: 'TheSuperIsMe'
								}
							})
							var mailOptions = {
							    from: 'Zeta Psi Superintendent <ZPHouseJobs@gmail.com>', // sender address
							    to: emailList, // list of receivers
							    subject: 'Reminder of upcoming House Job', // Subject line
							    text: '', // plaintext body
							    html: '<b>Dear Cleaner, please make note of your upcoming clean assignment:</b><div>Description: '+clean.Description+'.</div><div>To view the full details of this clean, please visit<a href="/cleanDetails/'+clean._id+'">The HouseJobs System</a></div>' // html body
							};
							transporter.sendMail(mailOptions, function(error, info){
							    if(error){
							        console.log('Mail Error: '+error);
							    }else{
							        console.log('Message sent: ' + info.response);
							    }
							});
						})
					}
					
				})
			});
			
		});
	},
	SetupDueReminderEmail: function(cleanId){
		Clean.findOne({_id:cleanId}).populate('Crew').exec(function(err,clean){
			Crew.populate(clean.Crew,{path:'Cleaners'},function(err,thisCrew){
				var reminderDate = new Date(clean.DueDate);
				console.log(reminderDate)
				var reminder = schedule.scheduleJob(reminderDate,function(){
					console.log('task succeeded!');
					
					if(clean!=null&&thisCrew!=null){
						Crew.findOne({_id:thisCrew._id}).populate('Cleaners').exec(function(err, thisCrew){
							Clean.findOne({_id:clean.id}).exec(function(err,newClean){
								if (!newClean.CheckedOff){
									newClean.Status=CleanStatus.Incomplete;
									var emailList = '';
									for(var i=0; i<thisCrew.Cleaners.length;i++){
										emailList+=thisCrew.Cleaners[i].Name+' <'+thisCrew.Cleaners[i].Email+'>, '
									}
									console.log(emailList);
									var transporter = nodemailer.createTransport({
										service: 'gmail',
										auth: {
							    			user: 'ZPHouseJobs@gmail.com',
							    			pass: 'TheSuperIsMe'
										}
									})
									var mailOptions = {
									    from: 'Zeta Psi Superintendent <ZPHouseJobs@gmail.com>', // sender address
									    to: emailList, // list of receivers
									    subject: 'Your House Job Assignment is Due.', // Subject line
									    text: '', // plaintext body
									    html: '<b>Dear Cleaner, please promptly complete your current clean assignment:</b><div>Description: '+clean.Description+'.</div><div>To view the full details of this clean, please visit<a href="/cleanDetails/'+clean._id+'">The HouseJobs System</a></div>' // html body
									};
									transporter.sendMail(mailOptions, function(error, info){
									    if(error){
									        console.log('Mail Error: '+error);
									    }else{
									        console.log('Message sent: ' + info.response);
									    }
									});
									newClean.save(function(err){
										return;
									})
								}
							});
							
						})
					}
					
				})
			});
		});
	},
	SendCheckoffConfirmationEmail:function(cleanId){
		Clean.findOne({_id:cleanId}).populate('Crew').exec(function(err,clean){
			Crew.populate(clean.Crew,{path:'Cleaners'},function(err,thisCrew){
				var emailList = '';
				for(var i=0; i<thisCrew.Cleaners.length;i++){
					console.log(thisCrew.Cleaners[i]);
					emailList+=thisCrew.Cleaners[i].Name+' <'+thisCrew.Cleaners[i].Email+'>, '
				}
				console.log(emailList);
				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
		    			user: 'ZPHouseJobs@gmail.com',
		    			pass: 'TheSuperIsMe'
					}
				})
				var mailOptions = {
				    from: 'Zeta Psi Superintendent <ZPHouseJobs@gmail.com>', // sender address
				    to: emailList, // list of receivers
				    subject: 'Your House Job Assignment has been checked off.', // Subject line
				    text: '', // plaintext body
				    html: '<b>Dear Cleaner, thank you for completing your recent house job:</b><div>Description: '+clean.Description+'.</div><div>To view the full details of this clean, please visit<a href="/cleanDetails/'+clean._id+'">The HouseJobs System</a></div>' // html body
				};
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        console.log('Mail Error: '+error);
				    }else{
				        console.log('Message sent: ' + info.response);
				    }
				});
			})
		})
	},
	SetupFineEmail: function(cleanId){
		Clean.findOne({_id:cleanId}).populate('Crew').exec(function(err,clean){
			Crew.populate(clean.Crew,{path:'Cleaners'},function(err,thisCrew){
				var emailList = '';
				for(var i=0; i<thisCrew.Cleaners.length;i++){
					emailList+=thisCrew.Cleaners[i].Name+' <'+thisCrew.Cleaners[i].Email+'>, '
				}
				var reminderDate = new Date(clean.FineDate);
				console.log(reminderDate)
				var reminder = schedule.scheduleJob(reminderDate,function(){
					Clean.findOne({_id:clean.id}).exec(function(err,newClean){
						if (!newClean.CheckedOff&&!newClean.Fined){
							newClean.Status=CleanStatus.Incomplete;
							var emailList = '';
							console.log('task succeeded!');
							if(clean!=null&&thisCrew!=null){
								Crew.findOne({_id:thisCrew._id}).populate('Cleaners').exec(function(err, thisCrew){
									Cleaner.find({ $or: [{Role:Role.Super},{Role:Role.SC},{Role: Role.AlphaPhi},{Role: Role.Phi},{Role:Role.Gamma}]}).exec(function(err,admins){
										var emailList = '';
										for(var i=0; i<thisCrew.Cleaners.length;i++){
											emailList+=thisCrew.Cleaners[i].Name+' <'+thisCrew.Cleaners[i].Email+'>, '
										}
										for(var i=0;i<admins.length;i++){
											emailList+=admins[i].Name+ '<'+admins[i].Email+'>, '
										}

										console.log(emailList);
										var transporter = nodemailer.createTransport({
											service: 'gmail',
											auth: {
								    			user: 'ZPHouseJobs@gmail.com',
								    			pass: 'TheSuperIsMe'
											}
										})
										var mailOptions = {
										    from: 'Zeta Psi Superintendent <ZPHouseJobs@gmail.com>', // sender address
										    to: emailList, // list of receivers
										    subject: 'Missed House Job Fine Notification', // Subject line
										    text: '', // plaintext body
										    html: '<b>Dear Cleaner, you have been fined $'+clean.FineAmount+' for missing your house job: '+clean.Description+'.</b></div><div>To view the full details of this clean, please visit<a href="/cleanDetails/'+clean._id+'">The HouseJobs System</a></div>' // html body
										};
										transporter.sendMail(mailOptions, function(error, info){
										    if(error){
										        console.log('Mail Error: '+error);
										    }else{
										        console.log('Message sent: ' + info.response);
										    }
										});
										newClean.Fined=true;;
										newClean.Status = CleanStatus.Fined;
									})
								})
							}
						}
					})	
					
				})
			});
		});
		
	}
}