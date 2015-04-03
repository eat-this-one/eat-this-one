angular.module('eat-this-one').factory('userManager', ['$http', 'md5', function($http, md5) {

    return {

        loadPicture : function loadPicture(user) {

            // Get user hash.
            var url = 'http://s.gravatar.com/avatar/' +
                md5.createHash(user.email.trim().toLowerCase()) +
                '?s=80&d=idontexist';
            $http({
                method : 'GET',
                url : url
            }).success(function(data, statusCode) {
                user.picture = url;
                user.icon = false;
            }).error(function(data, errorStatus, errorMsg) {
                user.picture = false;
            });
        }
    };
}]);
