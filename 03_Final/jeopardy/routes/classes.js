var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Class = mongoose.model('Class');
var Category = mongoose.model('Category');
var Field = mongoose.model('Field');

//---------------------- All -------------------------------------
router.get('/listAll', function(req, res, next) {
  	console.log("listAll");
  	
  	Class.find(function(err,classesObj){
  		if (err) return handleError(err);
  		
  	}).populate({path: 'categories', model: 'Category'})
  	.exec( function(err,classesObj){
  		Class.populate(classesObj, {path:'categories.fields', model:'Field'}, 
  			function(err, well){
  			if (err) return handleError(err);
  			res.json(well);
  		})
  		
  	})
});



//---------------------- Classes -------------------------------------

router.get('/listClasses', function(req, res, next) {
  	Class.find( function (err, classObj) {
  		if (err) return handleError(err);
  		console.log(classObj);
  		res.json(classObj);
  	})
});


router.post('/remove', function(req, res) {
	Category.find({ parentClass: req.body._id }, function(err,categories){
		for(var i = 0; i< categories.length; i++){
			categories[i].remove();
		}
	})

	Class.findOneAndRemove({ _id: req.body._id }, function(err, classObj){
		
		if(err){ return next(err); }
		res.json({});					
	})
});

router.post('/create', function(req, res) {
	console.log(req.body);
	var classObj = new Class(req.body);
	classObj.save();
  	res.json(classObj);
});

router.post('/modify', function(req, res) {
	Class.findById(req.body._id, function(err, classObj){
		if(err){ return next(err); }
		console.log(req.body);
		classObj.userid = req.body.classObjName;
		classObj.save(function(){
			res.json(classObj);		
		});
	})
});

//----------------------Category -------------------------------------

router.post('/listCategories', function(req, res, next) {
	console.log(req.body);
  		
  	Class.findById(req.body._id, function(err, classObj){
  		if (err) return handleError(err);
  		if(!classObj){
  			res.json({});	
  		} 
  		else {
  			if(classObj.categories.length == 0){	
  				console.log("empty");
  				res.json({});
  			}
  		}

  	}).populate('categories', function (err, categories) {
  		if (err) return handleError(err);
  		console.log("full");
  		console.log(categories);  		
  		res.json(categories);
  	});
});

router.post('/createCategory', function(req, res) {
	console.log(req.body);

	Class.findById(req.body.parentClass, function(err, classObj){
		if(err){ return next(err); }
		var category = new Category( req.body );
		category.save();
  		
		classObj.categories.push(category);
		classObj.save(function(){
			res.json(category);		
		});
	})
});

router.post('/modifyCategory', function(req, res) {
	Category.findById(req.body._id, function(err, category){
		if(err){ return next(err); }
		console.log(req.body);
		category.categoryName = req.body.categoryName;
		category.save(function(){
			res.json(category);		
		});
	})
});


router.post('/removeCategory', function(req, res) {
	Class.findById(req.body.parentClass , function(err, classObj){
		for(var i = 0; i< classObj.categories.length; i++){
			if(classObj.categories[i]._id == req.body._id){
				classObj.categories.slice(i,1);
				classObj.save();
			}
		}
	})

	Category.findOneAndRemove({ _id: req.body._id }, function(err){
		if(err){ return next(err); }
		res.json({});					
	})
});



//---------------------- Fields -------------------------------------

router.post('/listFields', function(req, res, next) {
		
  	Category.findById(req.body._id, function(err, category){
  		if (err) return handleError(err);
  		if(category.fields.length == 0){	
  			res.json({});
  		}

  	}).populate('fields', function (err, fields) {
  		if (err) return handleError(err);
  		res.json(fields);
  	});
});

router.post('/createField', function(req, res) {
	console.log(req.body);

	Category.findById(req.body.parentCategory, function(err, category){
		if(err){ return next(err); }
		var field = new Field( req.body );
		field.save();
  		
		category.fields.push(field);
		category.save(function(){
			res.json(field);		
		});
	})
});

router.post('/modifyField', function(req, res) {
	Field.findById(req.body._id, function(err, field){
		if(err){ return next(err); }
		console.log(req.body);
		field.question = req.body.question;
		field.answer = req.body.answer;
		field.save(function(){
			res.json(field);		
		});
	})
});


router.post('/removeField', function(req, res) {
	
	Category.findById(req.body.parentCategory , function(err, category){
		for(var i = 0; i< category.fields.length; i++){
			if(category.fields[i]._id == req.body._id){
				category.fields.slice(i,1);
				category.save();
			}
		}
		
	})	
	Field.findOneAndRemove({ _id: req.body._id }, function(err){
		if(err){ return next(err); }
		res.json({});					
	})
});



//---------------------- Other -------------------------------------
router.get('/removeAll', function(req, res) {
	Class.remove(function(err, classObj){
		if(err){ return next(err); }
		Category.remove(function(err, classObj){
			if(err){ return next(err); }
			Field.remove(function(err, classObj){
				if(err){ return next(err); }
				

				res.json({});	
			});						
		});
	});	
});		

module.exports = router;