angular.module('eat-this-one')
    .factory('newMealRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, meal) {

        // Adding the session token to the request.
        meal.token = sessionManager.getToken();

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal

        }).success(function(data) {

            appStatus.completed();
            notifier.show($scope.lang.mealbooked, 'success');

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = 'Meal can not be added. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
        });
    };

}]);
