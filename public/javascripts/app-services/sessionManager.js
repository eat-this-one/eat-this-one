angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'pushManager', 'eatConfig', function(authManager, pushManager, eatConfig) {

    return {

        initSession : function() {
            var token = localStorage.getItem('token');
            if (token !== null) {
                authManager.authenticate();
            }

            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

            // All cordova calls should be inside a deviceready listener.
            document.addEventListener('deviceready', function() {

                navigator.globalization.getPreferredLanguage(
                    function(language) {
                        var shortLang = language.value.substring(0, 2);
                        if (typeof $.eatLang[shortLang] !== 'undefined') {
                            $.eatLang.lang = $.eatLang[shortLang];
                        } else {
                            // We default to 'en' if any problem.
                            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
                        }
                    },
                    function() {
                        // We default to 'en' if any problem.
                        $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
                        console.log('Error getting preferred language');
                    }
                );

                // Register the app to receive and send notifications.
                pushManager.register();
            });
        },

        setUser : function(userData) {

            // Separating sensitive data from non-sensitive.
            localStorage.setItem('token', userData.token);
            delete userData.token;
            localStorage.setItem('user', JSON.stringify(userData));
        },

        getToken : function() {
            return localStorage.getItem('token');
        }
    }
}]);
