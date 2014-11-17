angular.module('eat-this-one').factory('authManager', ['$modal', function($modal) {

    var authenticated = false;

    // Just to have a reference of the current user in authManager
    // avoiding a circular dependency with sessionManager.
    var useridRef = false;

    return {

        // Returns whether the user is authenticated or not.
        isAuthenticated : function() {
            return (authenticated);
        },

        isUser : function(userid) {
            return (userid == useridRef);
        },

        // Marks the current user as authenticated
        authenticate : function(userid) {
            authenticated = true;
            useridRef = userid;
        },

        // Opens the login pop up.
        openSignInPopup : function() {

            var signInModal = $modal.open({
                templateUrl : 'templates/sign-in-popup.html',
                controller : 'signInPopupController'
            });

            signInModal.result.then(function(success) {
                authenticated = success;
            });
        },

        // Opens the pop up to sign up.
        openSignUpPopup : function() {

            var signUpModal = $modal.open({
                templateUrl : 'templates/sign-up-popup.html',
                controller : 'signUpPopupController'
            });

            signUpModal.result.then(function(success) {
                authenticated = success;
            });
        }
    }

}]);
