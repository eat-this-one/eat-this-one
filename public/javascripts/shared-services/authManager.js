angular.module('eat-this-one').factory('authManager', ['$modal', function($modal) {

    var authenticated = false;

    return {

        // Returns whether the user is authenticated or not.
        isAuthenticated : function() {
            return (authenticated);
        },

        // Marks the current user as authenticated
        authenticate : function() {
            authenticated = true;
        },

        // Opens the login pop up.
        openSignInPopup : function() {

            var modalInstance = $modal.open({
                templateUrl : 'templates/sign-in-popup.html',
                controller : 'signInPopupController'
            });

            modalInstance.result.then(function (success) {
                authenticated = success;
            });
        },

        // Opens the pop up to sign up.
        openSignUpPopup : function() {

            var modalInstance = $modal.open({
                templateUrl : 'templates/sign-up-popup.html',
                controller : 'signUpPopupController'
            });

            modalInstance.result.then(function (success) {
                authenticated = success;
            });
        }
    }

}]);
