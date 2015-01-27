angular.module('eat-this-one').factory('redirecter', ['$window', 'newLogRequest', function($window, newLogRequest) {

    var timeout = 300;

    return {

        redirect : function(url, log) {

            if (typeof log != 'undefined') {
                newLogRequest('click', log);
            }

            $('#id-body').fadeOut(timeout);
            setTimeout(function() {
                $window.location.href = url;
            }, timeout);
        },

        /**
         * Executes the callback function in the provided scope.
         *
         * Useful using action and menu items.
         */
        redirectAction : function($scope, callbackName) {
            $scope[callbackName]();
        }
    };
}]);
