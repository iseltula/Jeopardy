var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  userid: String,
  firstname: String,
  lastname: String,
  password: String,
  activated: Boolean,
  games : [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
  currentGame : {type: mongoose.Schema.Types.ObjectId, ref: 'Game'}
});

mongoose.model('User', UserSchema);

var GameSchema = new mongoose.Schema({
  game: {}
});

mongoose.model('Game', GameSchema);