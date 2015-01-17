angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'eatConfig', function(authManager, eatConfig) {

    return {

        initSession : function() {

            var token = sessionStorage.getItem('token');
            if (token !== null && token !== false) {
                var user = JSON.parse(sessionStorage.getItem('user'));
                authManager.authenticate(user.id);
            }

            // TODO: Load here user data.

            // We want to access strings through $.eatLang.lang.
            var userLang = navigator.language || navigator.userLanguage;
            if (typeof $.eatLang[userLang] !== 'undefined') {
                $.eatLang.lang = $.eatLang[userLang.substring(0, 2)];
            } else {
                $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
            }

        },

        setUser : function(userData) {
            // TODO Move token to cookies.
            // Separating sensitive data from non-sensitive.
            sessionStorage.setItem('token', userData.token);
            delete userData.token;
            sessionStorage.setItem('user', JSON.stringify(userData));
        },

        getToken : function() {
            return sessionStorage.getItem('token');
        },

        getUser : function() {
            return JSON.parse(sessionStorage.getItem('user'));
        },

        cleanSession : function() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            authManager.unauthenticate();
        }
    }
}]);
