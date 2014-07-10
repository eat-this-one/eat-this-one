angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', function(authManager) {

    return {

        initSession : function() {
            var token = sessionStorage.getItem('token');
            if (token !== null) {
                authManager.authenticate();
            }
        },

        setToken : function(authToken) {
            sessionStorage.setItem('token', authToken);
        },

        getToken : function() {
            return sessionStorage.getItem('token');
        }
    }
}]);
