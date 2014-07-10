angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', function(authManager) {

    return {

        initSession : function() {
            var token = localStorage.getItem('token');
            if (token !== null) {
                authManager.authenticate();
            }
        },

        setToken : function(authToken) {
            localStorage.setItem('token', authToken);
        },

        getToken : function() {
            return localStorage.getItem('token');
        }
    }
}]);
