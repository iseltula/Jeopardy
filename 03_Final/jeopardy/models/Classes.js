var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema({
  question: String,
  answer: String,
  parentCategory : {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});


var CategorySchema = new mongoose.Schema({
  categoryName: String,
  fields: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Field'} ],
  parentClass : {type: mongoose.Schema.Types.ObjectId, ref: 'Class'} 
});


var ClassSchema = new mongoose.Schema({
  classObjName: String,
  categories: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Category'} ]
});


mongoose.model('Field', FieldSchema);
mongoose.model('Category', CategorySchema);
mongoose.model('Class', ClassSchema);