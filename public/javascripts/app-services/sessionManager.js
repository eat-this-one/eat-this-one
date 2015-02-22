angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'pushManager', 'eatConfig', 'updateManager', function(authManager, pushManager, eatConfig, updateManager) {

    return {

        initSession : function() {

            var updatedApp = false;

            // Update to the current app version, later we will
            // update gcmregid, user token and show news to the user.
            var previousVersion = localStorage.getItem('version');
            if (previousVersion !== eatConfig.version) {
                updatedApp = true;
            }
            localStorage.setItem('version', eatConfig.version);

            var token = localStorage.getItem('token');
            if (token !== null && token !== false) {
                var user = JSON.parse(localStorage.getItem('user'));
                authManager.authenticate(user.id);
            }

            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

            // All cordova calls should be inside a deviceready listener.
            document.addEventListener('deviceready', function() {

                // Register the app to receive and send notifications.
                pushManager.register(updatedApp);

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

                        // TODO Here we can not add a newLogRequest circular reference.
                        console.log('Error getting preferred language');
                    }
                );

            });

            // Show info to the user about the new version if required.
            if (updatedApp === true) {
                updateManager.showChanges(previousVersion);
            }
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
        },

        cleanSession : function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            authManager.unauthenticate();
        }
    }
}]);
