'strict';

angular.module('security.login.form', [])


	.controller('LoginFormCtrl', ['$scope', 'security', function($scope, security) {

	  $scope.user = {};
	  $scope.authError = null;
	  $scope.authReason = null;

	  $scope.login = function() {
	    $scope.authError = null;

	    security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
	      if (loggedIn === false) {
	      	$scope.authError = "Invalid credentials";
	      }
	    });
  	};

  }]);
