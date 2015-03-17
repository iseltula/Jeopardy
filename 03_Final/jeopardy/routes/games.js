var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var User = mongoose.model('User');



router.post('/saveGame', function(req, res) {  
        
  User.findById(req.body.user._id)
  .exec(function(err, user){
    if(err){ return next(err); }
    if(!req.body.game._id){
      console.log("newGame")
      console.log(req.body.game)
      var game = new Game({game: req.body.game.game});
      game.save(function(err, newGame){
        user.games.push(newGame._id);
        user.currentGame = newGame._id;
        user.save();      
        
        res.json(newGame);
      });
     
    }else{
      console.log("updateGame")
      Game.findById(req.body.game._id, function(err, game){  
        console.log(req.body.game)
        console.log(game)      
        game.game = req.body.game.game;
        game.save( function(err, newGame){
          user.currentGame = newGame._id;
          user.save();
          res.json(newGame);  
        });        
      })
    }

  });
});

router.post('/deleteGame', function(req, res) {
  User.findById(req.body.user._id)
  .exec(function(err, user){
    console.log(user)
    console.log(req.body.game)
    for(var i = 0; i<user.games.length; i++){
      if(user.games[i] == req.body.game._id){
        user.games.splice(i,1);
      }
    }
    user.currentGame = null;
    console.log(user)
    user.save();
    res.json({});
  });
});


router.post('/listGames', function(req, res) {
  User.findById(req.body.user._id).populate('games')
  .exec(function(err, user){
    if(err){ return next(err); }
    console.log(user.games)
    res.json(user.games);
  });
});


router.get('/removeAll', function(req, res) {
  Game.remove(function(err,games){
    
      res.json({});  
    
    
  })
});

router.post('/currentGame', function(req, res) {
  
  User.findById(req.body.user._id).populate('currentGame')
  .exec(function(err, user){
    if(err){ return next(err); }
    console.log("currentGame Success")
    console.log(user.currentGame)
    res.json(user.currentGame);
  });
});

router.post('/newGame', function(req, res) {
  
  User.findById(req.body.user._id)
  .exec(function(err, user){
    if(err){ return next(err); }
    user.currentGame = null;
    user.save();
    res.json({});
  });
});

router.post('/selectGame', function(req, res) {
  
  User.findById(req.body.user._id)
  .exec(function(err, user){
    if(err){ return next(err); }
    user.currentGame = req.body.game._id;
    user.save();
    res.json(req.body.game);
  });
});




module.exports = router;
