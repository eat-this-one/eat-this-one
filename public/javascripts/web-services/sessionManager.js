angular.module('eat-this-one')
    .factory('sessionManager', ['eatAuth', function(eatAuth) {

    return {

        initSession : function() {
            var token = sessionStorage.getItem('token');
            if (token !== null) {
                eatAuth.authenticate();
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
