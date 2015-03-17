angular.module('classes-model', [])
.factory('classFac', ['$http', function($http){
    var o = {
      classesObj : [],
      selectedClassObj : {},
      categories : [],
      selectedCategory : {},
      fields : [],
      selectedField : {}
    }
    
    o.getAllClasses = function(cb) {
      return $http.get('/classes/listClasses').success(function(data){
          angular.copy(data, o.classesObj);
          cb();
      });
    };

    o.selectClass = function(classObj){     
      o.getAllCategories(classObj, function(){
        angular.copy(classObj, o.selectedClassObj);
        angular.copy({}, o.selectedCategory);
        angular.copy({}, o.fields);
        angular.copy({}, o.selectedField);  
      });
    }

    o.createClass = function(classObj) {
      $http.post('/classes/create', classObj).success(function(data){
        o.classesObj.push(data);
        angular.copy({}, o.selectedClassObj);
        angular.copy({}, o.categories);
        angular.copy({}, o.selectedCategory);
        angular.copy({}, o.fields);
        angular.copy({}, o.selectedField);
      });
  };

  o.removeClass = function(classObj) {
       $http.post('/classes/remove', classObj).success(function(data){
        for(var i=0; i< o.classesObj.length; i++){
          if(o.classesObj[i]._id == classObj._id){
            o.classesObj.splice(i,1);
          }
        }     
        angular.copy({}, o.selectedClassObj);
        angular.copy({}, o.categories);
        angular.copy({}, o.selectedCategory);
        angular.copy({}, o.fields);
        angular.copy({}, o.selectedField);      
      });

  };

  o.modifyClass = function(classObj) {
      $http.post('/classes/modify', classObj).success(function(data){
        for(var i=0; i< o.classesObj.length; i++){
          if(o.classesObj[i]._id == classObj._id){
            o.classesObj[i] = classObj;
          }
        }
        angular.copy({}, o.selectedClassObj);
        angular.copy({}, o.categories);
        angular.copy({}, o.selectedCategory);
        angular.copy({}, o.fields);
        angular.copy({}, o.selectedField);        
      });
  };

  //------------------------------------Category ----------------------
  
  o.getAllCategories = function(selectedClassObj ,cb) {
      $http.post('/classes/listCategories', selectedClassObj).success(function(data){
          angular.copy(data, o.categories);
          cb();
      });
    };
    
    o.selectCategory = function(category){
      angular.copy(category, o.selectedCategory);
      o.getAllFields( category,  function(){                
        angular.copy({}, o.selectedField);  
      });
      
    }

    
    o.createCategory = function(obj) {
      $http.post('/classes/createCategory', obj).success(function(data){
        o.getAllClasses( function(){
          o.selectedClassObj.categories.push(data._id);
          o.categories.push(data);
        angular.copy({}, o.selectedCategory);
          angular.copy({}, o.fields);
          angular.copy({}, o.selectedField);            
        });       
      });     
  };

  o.modifyCategory = function(category) {
      $http.post('/classes/modifyCategory', category).success(function(data){
        //modify categories
      for(var i=0; i< o.categories.length; i++){
          if(o.categories[i]._id == data._id){
            angular.copy(data, o.categories[i]);            
          }
        }
        angular.copy({}, o.selectedCategory);
        angular.copy({}, o.fields);
        angular.copy({}, o.selectedField);        
      });
  };
  
  o.removeCategory = function(category) {
       $http.post('/classes/removeCategory', category).success(function(data){
        o.getAllClasses( function(){
          for(var i=0; i< o.categories.length; i++){
            if(o.categories[i]._id == category._id){
              o.categories.splice(i,1);
            }
          }
          angular.copy({}, o.selectedCategory);             
          angular.copy({}, o.fields);
          angular.copy({}, o.selectedField);          
        });
        
      });

  };

  //------------------------------------Fields ----------------------
  
  o.getAllFields = function(selectedCategoryObj ,cb) {
      $http.post('/classes/listFields', selectedCategoryObj).success(function(data){
          angular.copy(data, o.fields);
          cb();
      });
    };
    
    o.selectField = function(field){
      angular.copy(field, o.selectedField);     
    }

    
    o.createField = function(obj) {
      $http.post('/classes/createField', obj).success(function(data){
        o.getAllCategories( o.selectedClassObj, function(){
          o.selectedCategory.fields.push(data._id);
          o.fields.push(data);
        angular.copy({}, o.selectedField);            
        });       
      });     
  };

  o.modifyField = function(field) {
      $http.post('/classes/modifyField', field).success(function(data){
        //modify categories
      for(var i=0; i< o.fields.length; i++){
          if(o.fields[i]._id == data._id){
            angular.copy(data, o.fields[i]);            
          }
        }
        angular.copy({}, o.selectedField);        
      });
  };
  
  o.removeField = function(field) {
       $http.post('/classes/removeField', field).success(function(data){
        o.getAllCategories( o.selectedClassObj ,  function(){
          for(var i=0; i< o.fields.length; i++){
            if(o.fields[i]._id == field._id){
              o.fields.splice(i,1);
            }
          }
          angular.copy({}, o.selectedField);          
        });
        
      });

  };
  

  return o;
}])
.controller('ClassCtrl', ['$scope','classFac', function($scope, classFac){
  	$scope.test = 'Hello world!';
  	$scope.classesObj = classFac.classesObj;
  	$scope.selectedClassObj = classFac.selectedClassObj;
  	$scope.categories = classFac.categories;  
  	$scope.selectedCategory = classFac.selectedCategory;
  	$scope.fields = classFac.fields;
  	$scope.selectedField = classFac.selectedField;
  	
  	$scope.selectClass = function(obj){
  		classFac.selectClass(obj);
  	}
  	
  	$scope.modifyClass = function(){
  		if(!$scope.selectedClassObj._id) return;
  		classFac.modifyClass({
  			_id: $scope.selectedClassObj._id,
  			classObjName: $scope.selectedClassObj.classObjName
  		})
  	}

  	$scope.removeClass = function(){
  		if(!$scope.selectedClassObj._id) return;
  		classFac.removeClass($scope.selectedClassObj);	
  	}

  	$scope.createClass = function(obj){
  		if(!$scope.selectedClassObj.classObjName) return;
  		classFac.createClass({
  			classObjName: $scope.selectedClassObj.classObjName
  		})
  	}
  	
  	//---------------------Categories ----------------------
  	$scope.selectCategory = function(obj){
  		classFac.selectCategory(obj);
  	}
  	
  	$scope.createCategory = function(obj){
  		if(!$scope.selectedCategory.categoryName) return;
  		classFac.createCategory({	
  			categoryName: $scope.selectedCategory.categoryName,
  			parentClass: $scope.selectedClassObj._id  			
  		})
  	}
  	
  	$scope.modifyCategory = function(){
  		if(!$scope.selectedCategory._id) return;
  		classFac.modifyCategory({
  			_id: $scope.selectedCategory._id,
  			categoryName: $scope.selectedCategory.categoryName	  			
  		})
  	}

  	$scope.removeCategory = function(){
  		if(!$scope.selectedCategory._id) return;
  		classFac.removeCategory($scope.selectedCategory);
  	}

  	//---------------------Fields ----------------------
  	
  	$scope.selectField = function(obj){
  		classFac.selectField(obj);
  	}
  	
  	$scope.createField = function(obj){
  		if(!$scope.selectedField.question ||  !$scope.selectedField.answer) return;
  		classFac.createField({	
  			question: $scope.selectedField.question,
  			answer: $scope.selectedField.answer,
  			parentCategory: $scope.selectedCategory._id  			
  		})
  	}
  	
  	$scope.modifyField = function(){
  		if(!$scope.selectedField._id) return;
  		classFac.modifyField({
  			_id: $scope.selectedField._id,
  			question: $scope.selectedField.question,
  			answer: $scope.selectedField.answer  			
  		})
  	}

  	$scope.removeField = function(){
  		if(!$scope.selectedField._id) return;
  		classFac.removeField($scope.selectedField);
  	}
}])