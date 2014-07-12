angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'eatConfig', function(authManager, eatConfig) {

    return {

        initSession : function() {

            var token = sessionStorage.getItem('token');
            if (token !== null) {
                authManager.authenticate();
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

        setToken : function(authToken) {
            sessionStorage.setItem('token', authToken);
        },

        getToken : function() {
            return sessionStorage.getItem('token');
        }
    }
}]);
