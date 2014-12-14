angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'pushManager', 'eatConfig', function(authManager, pushManager, eatConfig) {

    return {

        initSession : function() {
            var token = localStorage.getItem('token');
            if (token !== null) {
                var user = JSON.parse(localStorage.getItem('user'));
                authManager.authenticate(user.id);
            }

            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

            // All cordova calls should be inside a deviceready listener.
            document.addEventListener('deviceready', function() {

                // TODO Check that this works.
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
            // The pwd should not come from the backend.
            delete userData.token;
            localStorage.setItem('user', JSON.stringify(userData));
        },

        getToken : function() {
            return localStorage.getItem('token');
        },

        getUser : function() {
            return JSON.parse(localStorage.getItem('user'));
        }
    }
}]);
