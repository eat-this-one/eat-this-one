angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'eatConfig', 'pushManager', 'updateManager', 'localisationManager', function(authManager, eatConfig, pushManager, updateManager, localisationManager) {

    return {

        initSession : function() {

            var updatedApp = false;

            // Update to the current app version, later we will
            // update gcmregid.
            var previousVersion = localStorage.getItem('version');
            if (previousVersion !== eatConfig.version &&
                    previousVersion !== null &&
                    this.getUser() !== null) {
                updatedApp = true;
            }
            localStorage.setItem('version', eatConfig.version);

            var token = sessionStorage.getItem('token');
            if (token !== null && token !== false) {
                var user = JSON.parse(sessionStorage.getItem('user'));
                authManager.authenticate(user._id);
            }

            localisationManager.setLanguage();

            // Creates fake registration id.
            pushManager.register(updatedApp);

            localisationManager.setCountry();

            // Show info to the user about the new version if required.
            if (updatedApp === true && this.getUser() !== null) {
                updateManager.showChanges(previousVersion);
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
    };
}]);
