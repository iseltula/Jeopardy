angular.module('adminInterface', ['ui.router','classes-model'])
.factory('usersFac', ['$http', function($http){
  	var o = {
  		users : [],
  		selectedUser : {}
  	}
  	
  	o.getAll = function() {
    	return $http.get('/users/listUsers').success(function(data){
      		angular.copy(data, o.users);
    	});
  	};

  	o.selectUser = function(userObj){
  		angular.copy(userObj, o.selectedUser); 
  	}

  	o.create = function(userObj) {
	  	$http.post('/users/create', userObj).success(function(data){
	    	o.users.push(data);
	  	});
	};

	o.remove = function(userObj) {
	  	 $http.post('/users/remove', userObj).success(function(data){
	    	for(var i=0; i< o.users.length; i++){
	    		if(o.users[i]._id == userObj._id){
	    			o.users.splice(i,1);
	    		}
	    	}
	    	angular.copy({}, o.selectedUser); 	    	
	  	});

	};

	o.modify = function(userObj) {
	  	$http.post('/users/modify', userObj).success(function(data){
	    	for(var i=0; i< o.users.length; i++){
	    		if(o.users[i]._id == userObj._id){
	    			o.users[i] = userObj;
	    		}
	    	}	    	
	  	});
	};

  	return o;
}])
.controller('UserCtrl', ['$scope', 'usersFac', function($scope, usersFac){
  $scope.test = 'Hello world!';
    $scope.users = usersFac.users;
    $scope.selectedUser = usersFac.selectedUser;
    $scope.selectUser = function(obj){
      usersFac.selectUser(obj);
    }
    
    $scope.modifyUser = function(){
      if(!$scope.selectedUser._id) return;
      usersFac.modify({
        _id: $scope.selectedUser._id,
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname
      })
    }

    $scope.removeUser = function(){
      if(!$scope.selectedUser._id) return;
      usersFac.remove($scope.selectedUser); 
    }

    $scope.createUser = function(obj){
      if(!$scope.selectedUser.userid || !$scope.selectedUser.password) return;
      usersFac.create({
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname,
        activated: true
      })
    }

}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('users', {
      resolve: {
        userPromise: ['usersFac', function(usersFac){
          return usersFac.getAll();
        }]
    },
        url: '/users',
        templateUrl: 'javascripts/Admin/users.html',
        controller: 'UserCtrl'
    });    

  $urlRouterProvider.otherwise('users');
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('classes', {
      resolve: {
        classPromise: ['classFac', function(classFac){
          return classFac.getAllClasses(function(){});
        }]
    },
      url: '/classes',
      templateUrl: 'javascripts/classes.html',
      controller: 'ClassCtrl',      
  });
}])
