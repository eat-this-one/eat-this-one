angular.module('eat-this-one').factory('photoRequest', ['$http', 'eatConfig', 'sessionManager', function($http, eatConfig, sessionManager) {

    return function(dish, callback) {

        if (typeof callback === "undefined") {
            // We do nothing, but we have to fill callback
            // with something.
            callback = function(dish) {
                // We do nothing.
            }.bind(this);
        }

        if (typeof dish.photoid === "undefined") {
            console.log('This dish does not have a photoid, ' +
                ' the consumer is responsible of ensuring that there ' +
                ' is a photoid here.');
            dish.imgSrc = 'images/default.svg';
            return false;
        }

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/photos',
            params : { id: dish.photoid, token : sessionManager.getToken() }
        }).success(function(data) {
            dish.imgSrc = 'data:image/jpeg;base64,' + data.data;

            // Callback to cache or whatever.
            callback(dish);
        }).error(function(data, errorStatus, errorMsg) {
            // Fallback to the default image.
            dish.imgSrc = 'images/default.svg';
        });
    };
}]);
