angular.module('userInterface', ['ui.router','checklist-model','classes-model'])
.run(["$rootScope", "$location", function ($rootScope, $location) {

    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        console.log(userInfo);
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/login");
        }
    });
}])
.factory("authenticationSvc", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        $http.post("/api/login", { userName: userName, password: password })
            .then(function (result) {
                userInfo = {
                    accessToken: result.data.access_token,
                    user: result.data.user
                };
                $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                deferred.resolve(userInfo);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: "/api/logout",
            headers: {
                "access_token": userInfo.accessToken
            }
        }).then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function updateUser(obj) {
        userInfo.user = obj;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        updateUser : updateUser,
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}])
.factory('userFac', ['$http', function($http){
	var o = {
		selectedUser : {}
	}
	
	o.create = function(userObj) {
  	$http.post('/users/create', userObj).success(function(data){      
  	   angular.copy( {}, o.selectedUser);
    });

  };

	o.remove = function(userObj) {
  	 $http.post('/users/remove', userObj).success(function(data){
	    	angular.copy({}, o.selectedUser); 	    	
	  	});
	};

	o.modify = function(userObj, cb) {
	   $http.post('/users/modify', userObj).success(function(data){	       
         cb(data);
     });
	};

  return o;
}])
.controller('UserCtrl', ['$scope', '$location', 'authenticationSvc', 'auth', 'userFac',
         function($scope, $location, authenticationSvc, auth, userFac){
    //$scope.selectedUser = userFac.selectedUser;
    //$scope.selectedUser  = userFac.selectedUser;
    $scope.selectedUser = auth.user;
  


    $scope.createUser = function(){
      if(!$scope.selectedUser.userid || !$scope.selectedUser.password) return;
      userFac.create({
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname,
        activated: false
      })
      $location.path("/login");
    }
    
    $scope.modifyUser = function(){
      if(!$scope.selectedUser._id) return;
      userFac.modify({
        _id: $scope.selectedUser._id,
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname
      }, function(obj){

      })
    }

    $scope.removeUser = function(){
      if(!$scope.selectedUser._id) return;
      userFac.remove($scope.selectedUser);
      authenticationSvc.logout()
      .then(function (result) {
          $scope.userInfo = null;
          $location.path("/login");
      }, function (error) {
          console.log(error);
      });
    }

}])
.controller('RegisterCtrl', ['$scope', '$location', 'authenticationSvc', 'auth', 'userFac',
         function($scope, $location, authenticationSvc, auth, userFac){
    //$scope.selectedUser = userFac.selectedUser;
    $scope.selectedUser  = userFac.selectedUser;
    //$scope.selectedUser = auth.user;
  
        

    $scope.createUser = function(){
      if(!$scope.selectedUser.userid || !$scope.selectedUser.password) return;
      userFac.create({
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname,
        activated: false
      })
      $location.path("/login");
    }
    
    $scope.modifyUser = function(){
      if(!$scope.selectedUser._id) return;
      userFac.modify({
        _id: $scope.selectedUser._id,
        userid: $scope.selectedUser.userid,
        password: $scope.selectedUser.password,
        firstname: $scope.selectedUser.firstname,
        lastname: $scope.selectedUser.lastname
      }, function(obj){

      })
    }

    $scope.removeUser = function(){
      if(!$scope.selectedUser._id) return;
      userFac.remove($scope.selectedUser);
      authenticationSvc.logout()
      .then(function (result) {
          $scope.userInfo = null;
          $location.path("/login");
      }, function (error) {
          console.log(error);
      });
    }

}])
.controller('GamesCtrl', ['$scope','$location','games', function($scope,$location, games){

  $scope.games = games.games;
  //[ {numberOfOpenQuestions: 10, numberOfQuestions: 30, _id: 1, game: { stat: 'building' } }, {_id: 2, game: { stat: 'inGame' } } ];

  $scope.init = function(){
    games.getAllGames();
  }

  $scope.chooseGame = function(obj){
    games.selectGame(obj, function(){
      $location.path("/currentGame");
    })
  }

  $scope.newGame = function(){
    games.newGame();
    $location.path("/currentGame");
  }

  $scope.deleteGame = function(obj){
    games.selectGame(obj, function(){
      games.deleteGame();  
    })    
  }

}])
.controller('StatisticsCtrl', ['$scope','games', function($scope, games){
  // $scope.games = [ {_id: 1, game: { numberOfOpenQuestions: 10, numberOfQuestions: 30, stat: 'building', player: [ {name: '1', points: 4 }, {name: '2', points: 10}] } }, {numberOfOpenQuestions: 10, numberOfQuestions: 30, _id: 2, game: { stat: 'inGame' } } ];

  $scope.chosengame = games.currentGameObj;

  // $scope.chooseGame = function(cg){
  //   console.log("Selbstmord"+cg);
  //   $scope.chosengame = cg;
  // };

  $scope.games = games.games;
  $scope.Math = window.Math;

  //[ {numberOfOpenQuestions: 10, numberOfQuestions: 30, _id: 1, game: { stat: 'building' } }, {_id: 2, game: { stat: 'inGame' } } ];

  $scope.init = function(){
    games.getAllGames();
  }

  $scope.chooseGame = function(obj){
    games.selectGame(obj, function(){

    })
  }


}])
.controller("LoginController", ["$scope", "$location", "$window", "authenticationSvc",function ($scope, $location, $window, authenticationSvc) {
    $scope.userInfo = null;
    $scope.login = function () {
        authenticationSvc.login($scope.userName, $scope.password)
            .then(function (result) {
                $scope.userInfo = result;
                $location.path("/user");
            }, function (error) {
                $window.alert("Invalid credentials");
                console.log(error);
            });
    };

    $scope.register = function () {
        $location.path("/register");        
    };
}])
.controller("LogoutController", ["$scope", "$location", "authenticationSvc", "auth",function ($scope, $location, authenticationSvc, auth) {
    $scope.userInfo = auth;

    $scope.logout = function () {

        authenticationSvc.logout()
            .then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
            }, function (error) {
                console.log(error);
            });
    };    
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
    .state('user', {
      resolve: {
        userPromise: ['userFac', function(userFac){
          return null;
        }],
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
        
      },
      url: '/user',
      templateUrl: 'javascripts/User/user.html',
      controller: 'UserCtrl'
    }).state('classes', {
      resolve: {
        classPromise: ['classFac', function(classFac){
          return classFac.getAllClasses(function(){});
        }],
        auth: function ($q, authenticationSvc) {
          var userInfo = authenticationSvc.getUserInfo();
          if (userInfo) {
              return $q.when(userInfo);
          } else {
              return $q.reject({ authenticated: false });
          }
          
        }        
      },
      url: '/classes',
      templateUrl: 'javascripts/classes.html',
      controller: 'ClassCtrl',      
  })
  .state('games', {
      resolve: {
        auth: function ($q, authenticationSvc) {
          var userInfo = authenticationSvc.getUserInfo();
          if (userInfo) {
              return $q.when(userInfo);
          } else {
              return $q.reject({ authenticated: false });
          }
          
        }        
      },
      url: '/games',
      templateUrl: 'javascripts/User/games.html',
      controller: 'GamesCtrl',      
  })
  .state('current', {
    resolve: {
      auth: function ($q, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
            return $q.when(userInfo);
        } else {
            return $q.reject({ authenticated: false });
        }
        
      }        
    },      
    url: '/currentGame',
      templateUrl: 'javascripts/User/currentGame.html',
      controller: 'CurrentGameCtrl',      
  })
  .state('statistics', {
      resolve: {
        auth: function ($q, authenticationSvc) {
          var userInfo = authenticationSvc.getUserInfo();
          if (userInfo) {
              return $q.when(userInfo);
          } else {
              return $q.reject({ authenticated: false });
          }
          
        }        
      },
      url: '/statistics',
      templateUrl: 'javascripts/User/statistics.html',
      controller: 'StatisticsCtrl',      
  })
  .state('login', {      
      url: '/login',
      templateUrl: 'javascripts/User/login.html',
      controller: 'LoginController',
      resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.reject();
            } else {
                return $q.when();
            }
        }
      }      
  }).state('register', {
      resolve: {
        userPromise: ['userFac', function(userFac){
          return null;
        }],
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.reject();
            } else {
                return $q.when();
            }
        }        
      },
        url: '/register',
        templateUrl: 'javascripts/User/register.html',
        controller: 'RegisterCtrl'
    }).state('logout', {      
      url: '/logout',
      templateUrl: 'javascripts/User/logout.html',
      controller: "LogoutController",
      resolve: {
        auth: function ($q, authenticationSvc) {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
      }
  });
  

}])
.factory('games', ['$http', 'authenticationSvc', function($http, authenticationSvc){
      var o = {      
        classesObj:[],  
        games: [],
        currentGameObjId: null,
        currentGameObj: {state: 'building',
                                      categories:[],
                                      player:[]}
      };

      o.getAllClasses = function(){
        return $http.get('/classes/listAll').success(function(data){
          angular.copy(data, o.classesObj);
        });
      }

      o.getAllGames = function() {        
        var post = {user: authenticationSvc.getUserInfo().user};
        return $http.post('/games/listGames',post).success(function(data){
          angular.copy(data, o.games);
        });
      };

      o.saveGame = function() {
        console.log(o.currentGameObj);
        console.log("save gmae");
        var post = {user: authenticationSvc.getUserInfo().user, game: { _id : o.currentGameObjId  , game: o.currentGameObj}};
         console.log(post);
        return $http.post('/games/saveGame', post).success(function(data){
          angular.copy(data.game, o.currentGameObj);
          o.currentGameObjId = data._id;
          o.getAllGames();
        });
      };

      o.selectGame = function(game, cb) {
        console.log(game);
        var post = {user: authenticationSvc.getUserInfo().user, game: game};
        return $http.post('/games/selectGame', post).success(function(data){
          console.log(data);
          angular.copy(data.game, o.currentGameObj);
          o.currentGameObjId = data._id;        
          cb();
        });
        
      };

      o.currentGame = function() {
        
        var post = {user: authenticationSvc.getUserInfo().user};
        
        return $http.post('/games/currentGame', post).success(function(data){
          
          angular.copy(data.game, o.currentGameObj);
          o.currentGameObjId = data._id;
          if(!o.currentGameObj.state){
            angular.copy({state: 'building',
                                      categories:[],
                                      player:[]},
            o.currentGameObj );            
          } 

          console.log(o.currentGameObj);
        });
      };

      o.deleteGame = function() {        
        console.log(o.currentGameObjId);
        console.log(o.currentGameObj);
        var post = {user: authenticationSvc.getUserInfo().user, game: { _id:o.currentGameObjId  ,game: o.currentGameObj}};
        return $http.post('/games/deleteGame', post).success(function(data){
          for(var i=0; i< o.games.length;i++){
            if(o.games[i]._id == o.currentGameObjId){
              o.games.splice(i,1);
            }

          }
          angular.copy({state: 'building',
                                      categories:[],
                                      player:[]}, o.currentGameObj); 
          o.currentGameObjId = null;

        });
      };

      o.newGame = function(){
        var post = {user: authenticationSvc.getUserInfo().user, game: { _id:o.currentGameObjId  ,game: o.currentGameObj}};
        return $http.post('/games/newGame', post).success(function(data){
          angular.copy({state: 'building',
                                      categories:[],
                                      player:[]}, o.currentGameObj); 
          o.currentGameObjId = null;
        });
      } 

  return o;
      
}])
.controller('CurrentGameCtrl', [
        '$scope',
        'games',
        '$location',
        'authenticationSvc',
    function ($scope, games,$location, authenticationSvc) {

        //--------------------------------Config ---------------------------

        //$scope.posts = posts.posts;
        $scope.classesObj = games.classesObj;      
        $scope.limitCategories = 6;
        $scope.buff;
        
        $scope.selec = games.currentGameObj;

        $scope.initClasses = function(){
          console.log("weeeee");
          games.getAllClasses();
          games.currentGame();
        }

        $scope.putList = function(){
          if($scope.buff.length<=0) return;
          $scope.selec.player.push({name: $scope.buff, points: 0});
          $scope.buff = "";
        };

        $scope.validConfig = function(){
            if(!$scope.selec.player ||$scope.selec.player.length <=1) return false; 
            return true;           
        }

        $scope.saveGame = function(){
          games.saveGame();
        };

        $scope.currentGame = function(){
          games.currentGame();
        };
        $scope.deleteGame = function(){
          games.deleteGame();
        };

        $scope.calculateSizes = function(){
          $scope.selec.numberOfQuestions = 0;
          $scope.selec.maxColSize =0;
          for(var i=0; i<$scope.selec.categories.length; i++){
            $scope.selec.numberOfQuestions+=$scope.selec.categories[i].category.fields.length;
            if($scope.selec.categories[i].category.fields.length>$scope.selec.maxColSize){
              $scope.selec.maxColSize = $scope.selec.categories[i].category.fields.length;
            }
          }
        }
        
        $scope.addGame = function(){
          if(!$scope.validConfig()) return;
          $scope.calculateSizes();
          $scope.selec.myArray = [];
          for(var i= 0; i<$scope.selec.maxColSize; i++){
            $scope.selec.myArray.push(i);
          }
          $scope.selec.numberOfOpenQuestions = $scope.selec.numberOfQuestions;
          $scope.selec.state ='inGame';
          
          games.save();
        };
        $scope.newGame = function(){
          games.newGame();
        }


        //-------------------------Current Game Engine ----------------
        
        //Flag Variables for the Game
        $scope.actual = '';
        $scope.player = '';
        $scope.solutionShow = false;
        //console.log("Start:"+$scope.player);

        $scope.showQuestion = function(cl, val){
          //set Question to actualFlag, the status to show, and assign his value
          $scope.actual = cl;
          cl.stat = "show";
          cl.val = val;
        };

        

        $scope.showAnswer = function(pl){
          console.log("ShowAnswer called with"+pl.name)
          $scope.player = pl;//set the player with the anser
        };

        $scope.addPuncts = function(){
          if(!$scope.solutionShow){
            $scope.player.points += $scope.actual.val;
          }          
          $scope.solutionShow = true          
        };

        $scope.subPuncts = function(){
          if(!$scope.solutionShow){
            $scope.player.points -= $scope.actual.val;
            $scope.player = '';
          }          
        };

        $scope.BacktoField = function(){
          $scope.solutionShow = false;
          $scope.actual.stat = "done";
          $scope.player = '';
          $scope.actual = '';

          $scope.selec.numberOfOpenQuestions--;
          if($scope.selec.numberOfOpenQuestions == 0){
            $scope.selec.state ='finished';
          }
        }

        $scope.SaveAndGoBack = function(){
          games.saveGame();
          $location.path("/games");

        }

}])

        


