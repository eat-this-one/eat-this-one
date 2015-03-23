angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'pushManager', 'eatConfig', 'updateManager', 'localisationManager', function(authManager, pushManager, eatConfig, updateManager, localisationManager) {

    return {

        initSession : function() {

            var updatedApp = false;

            // Update to the current app version, later we will
            // update gcmregid, user token and show news to the user.
            var previousVersion = localStorage.getItem('version');
            if (previousVersion !== eatConfig.version &&
                    previousVersion !== null &&
                    this.getUser() !== null) {
                updatedApp = true;
            }
            localStorage.setItem('version', eatConfig.version);

            var token = localStorage.getItem('token');
            if (token !== null && token !== false) {
                var user = JSON.parse(localStorage.getItem('user'));
                authManager.authenticate(user._id);
            }

            // We need the language for everything, at least getting
            // the default one should be fast.
            localisationManager.setLanguage();

            document.addEventListener('deviceready', function() {
                // Register the app to receive and send notifications.
                pushManager.register(updatedApp);
            });

            localisationManager.setCountry();

            // Show info to the user about the new version if required.
            if (updatedApp === true && this.getUser() !== null) {
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
    };
}]);
