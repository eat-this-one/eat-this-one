angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'messagesHandler', 'notifier', 'eatConfig', function($window, messagesHandler, notifier, eatConfig) {

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
        }
    }
}]);
