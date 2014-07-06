angular.module('eat-this-one').factory('eatAuth', ['$modal', function($modal) {

    var authenticated = false;

    return {

        // Returns whether the user is authenticated or not.
        isAuthenticated : function() {
            return (authenticated);        
        },

        // Opens the login pop up.
        openLoginPopup : function() {

            var modalInstance = $modal.open({
                templateUrl : 'templates/auth-popup.html',
                controller : 'loginPopupController'
            });

            modalInstance.result.then(function (success) {
                authenticated = success;
            });
        }
    }

}]);
