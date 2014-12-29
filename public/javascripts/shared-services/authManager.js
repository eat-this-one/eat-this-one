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

        unauthenticate : function() {
            authenticated = false;
            useridRef = false;
        }
    }

}]);
