angular.module('eat-this-one')
    .factory('newMealRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier) {

    return function($scope, meal, mealCallback, errorCallback) {

        // Adding the session token to the request.
        meal.token = sessionManager.getToken();

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal

        })
        .success(mealCallback)
        .error(errorCallback);
    };

}]);
