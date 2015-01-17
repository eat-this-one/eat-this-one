angular.module('eat-this-one').factory('redirecter', ['$window', function($window) {

    var timeout = 500;

    return {

        redirect : function(url) {
            $('#id-body').fadeOut(timeout);
            setTimeout(function() {
                $window.location.href = url;
            }, timeout);
        }
    };
}]);
