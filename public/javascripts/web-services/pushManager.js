angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'eatConfig', function($window, eatConfig) {

    return {

        register : function() {

            if (localStorage.getItem('gcmRegId') !== null) {
                return;
            }

            // Just a fake per-session reg id for testing purposes.
            // We don't care if it is stored in localStorage as we don't
            // care about security in web.
            var randomNumber = Math.random() + new Date().getTime();
            localStorage.setItem('gcmRegId', randomNumber);

            updateRegistration(randomNumber);
        }
    };
}]);

/**
 * Mock just to mimic the app functionality to detect issues injecting services.
 */
function updateRegistration(regid) {

    var bodyscope = angular.element('#id-body');
    bodyscope.ready(function() {
        if (typeof bodyscope.injector() !== "undefined") {
            var updateRegIdRequest = bodyscope.injector().get('updateRegIdRequest');
            updateRegIdRequest(regid);
        }
    });
}
