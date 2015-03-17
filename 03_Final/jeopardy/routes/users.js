var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var User = mongoose.model('User');



var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "dawsweetygott@gmail.com",
       pass: "ItesmMonterrey"
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Jeopardy <dawsweetygott@gmail.com>', // sender address
    to: 'patrick.wijerama@gmail.com', // list of receivers
    subject: 'Welcome to Jeopardy ', // Subject line
    text: '', // plaintext body
    html: ' ' // html body
};



router.get('/listUsers', function(req, res, next) {
  	User.find(function(err, posts){
    	if(err){ return next(err); }
    	console.log(posts);
    	res.json(posts);
  	});
});

router.get('/removeAll', function(req, res) {
	User.remove(function(err, user){
		if(err){ return next(err); }
		res.json({});	
	});
});		



router.post('/create', function(req, res) {
	console.log(req.body);
	var user = new User(req.body);
	user.save(function(err,obj){
		mailOptions.text = "Welcome "+ req.body.firstname +" to Jeopardy. "+
    	"Please Click this link <a href='http://localhost:3000/users/activate?userid="+req.body.userid+" '> Welcome </a>";
        
        mailOptions.html = "Welcome "+ req.body.firstname +" to Jeopardy. "+
    	"Please Click this link <a href='http://localhost:3000/users/activate?userid="+req.body.userid+" '> Welcome </a>";
        
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		    }else{
		    	
		        console.log('Message sent: ' + info.response);
		        
		    }
		});
		res.json(obj);
	});

	
  	
});

router.get('/activate', function(req, res) {
	User.findOne({userid:req.query.userid},function(err, userObj){
		if(err){ return next(err); }
		userObj.activated = true;		
		userObj.save(function(err, obj){
			res.writeHead(301,
				  {Location: 'http://localhost:3000/'}
				);
			res.end();			
		});
	})
});

router.get('/deactivate', function(req, res) {
	
	User.findOne({userid:req.query.userid},function(err, userObj){
		if(err){ return next(err); }
		userObj.activated = false;		
		userObj.save(function(err, obj){
			res.json(obj);		
		});
	})
});


router.post('/modify', function(req, res) {
	User.findById(req.body._id, function(err, user){
		if(err){ return next(err); }
		console.log(req.body);
		user.userid = req.body.userid;
		user.password = req.body.password;
		user.firstname = req.body.firstname;
		user.lastname = req.body.lastname;
		user.save(function(err, obj){
			console.log(obj);
			res.json(obj);		
		});
	})
});



router.post('/remove', function(req, res) {
	User.findOneAndRemove({ _id: req.body._id }, function(err, user){
		if(err){ return next(err); }
		res.json({});					
	})
});




router.post('/login', function(req, res, next) {
	User.findOne({ userid: req.body.userid }, function(err, user){
		if(err){ return next(err); }
		if(user && user.password === req.body.password){
			res.json(user);	
		}else{
			res.json({});	
		}		
	})	
});





module.exports = router;
