angular.module('eat-this-one')
    .factory('sessionManager', ['eatAuth', function(eatAuth) {

    return {

        initSession : function() {
            var token = localStorage.getItem('token');
            if (token !== null) {
                eatAuth.authenticate();
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
