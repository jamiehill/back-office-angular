'strict';


module.exports = angular.module('security.service', [

	'security.login'])

	.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$modal', function($http, $q, $location, queue, $modal) {

	  var loginDialog = null;

	  /**
	   * Redirect to the given url (defaults to '/')
	   */
	  function redirect(url) {
	    $location.path(url || '/');
	  }

	  /**
	   * Login form dialog stuff
	   */
	  function openLoginDialog() {
	    if (loginDialog)
	      throw new Error('Trying to open a dialog that is already open!');
	    
	    loginModal = $modal.open({
	      templateUrl: require('./login/form.tpl.html'),
	      controller: 'LoginFormCtrl'
	    });
	  }

	  /**
	   * Close the login dialog
	   **/
	  function closeLoginDialog(success) {
	    if (loginDialog)
	        loginDialog.close(success);
	  }

	  /**
	   * Handle completion of dialog closure
	   */
	  function onLoginDialogClosed(success) {
	    loginDialog = null;
	    if (success)
	      queue.retryAll();
	    else
	    {
	      queue.cancelAll();
	      redirect();
	    }
	  }

	  // The public API of the service
	  var service = {

	    // Show the modal login dialog
	    showLogin: function() {
	      openLoginDialog();
	    },

	    // Attempt to authenticate a user by the given email and password
	    login: function(email, password) {
	      var request = $http.post('/login', {email: email, password: password});
	      return request.then(function(response) {
	        service.currentUser = response.data.user;
	        if (service.isAuthenticated()) {
	          closeLoginDialog(true);
	        }
	        return service.isAuthenticated();
	      });
	    },

	    // Give up trying to login and clear the retry queue
	    cancelLogin: function() {
	      closeLoginDialog(false);
	      redirect();
	    },

	    // Logout the current user and redirect
	    logout: function(redirectTo) {
	      $http.post('/logout').then(function() {
	        service.currentUser = null;
	        redirect(redirectTo);
	      });
	    },

	    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
	    requestCurrentUser: function() {
	      if (service.isAuthenticated())
	        return $q.when(service.currentUser);

	      else 
	      {
	        return $http.get('/current-user').then(function(response) {
	          service.currentUser = response.data.user;
	          return service.currentUser;
	        });
	      }
	    },

	    // Information about the current user
	    currentUser: null,

	    // Is the current user authenticated?
	    isAuthenticated: function(){
	      return !!service.currentUser;
	    },
	    
	    // Is the current user an adminstrator?
	    isAdmin: function() {
	      return !!(service.currentUser && service.currentUser.admin);
	    }
	  };

  		return service;
	}]);	