angular.module('eat-this-one').factory('redirecter', ['$window', function($window) {

    var timeout = 300;

    return {

        redirect : function(url) {

            if (typeof url === "undefined") {
                url = 'index.html';
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
        },

        /**
         * Executes the required menu callback.
         */
        redirectMenuItem : function($scope, callbackName) {
            $scope.menu[callbackName]();
        }
    };
}]);
