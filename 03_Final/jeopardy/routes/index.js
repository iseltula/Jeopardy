var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var User = mongoose.model('User');


var tokens = [];

function requiresAuthentication(request, response, next) {
    console.log(request.headers);
    if (request.headers.access_token) {
        var token = request.headers.access_token;
        if (_.where(tokens, token).length > 0) {
            var decodedToken = jwt.decode(token, '123456ABCDEF');
            if (new Date(decodedToken.expires) > new Date()) {
                next();
                return;
            } else {
                removeFromTokens(decodedToken);
                response.end(401, "Your session is expired");
            }
        }
    }
    response.end(401, "No access token found in the request");
}

function removeFromTokens(token) {    
    for (var counter = 0; counter < tokens.length; counter++) {
        if (tokens[counter] === token) {
            tokens.splice(counter, 1);
            break;
        }
    }
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/interface', function(req, res) {
  res.render('interface', { title: 'Express' });
});


router.post('/api/login', function(request, response) {
    var userName = request.body.userName;
    var password = request.body.password;
    
    User.findOne({userid : userName}, function(err, user){
    	if(err) return response.send(401, "Invalid credentials");
    	if(!user || user.password!=password ) return response.send(401, "Invalid credentials");

    	console.log("valid user :) ");
	    var expires = new Date();
        expires.setDate((new Date()).getDate() + 5);
        var token = jwt.encode({
            userName: userName,
            expires: expires
        }, '123456ABCDEF');

        tokens.push(token);
        console.log(user);

        response.send(200, { access_token: token, user: user });
    
    })    
});

router.post('/api/logout', function(request, response) {
    var token= request.headers.access_token;
    removeFromTokens(token);
    response.send(200);
});


module.exports = router;
