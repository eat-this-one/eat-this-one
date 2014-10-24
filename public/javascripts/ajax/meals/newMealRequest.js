angular.module('eat-this-one')
    .factory('newMealRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, meal) {

        // Adding the session token to the request.
        meal.token = sessionManager.getToken();

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal

        }).success(function(data) {

            appStatus.completed();
            notifier.show($scope.lang.mealbooked, $scope.lang.mealbookedinfo, 'success');

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errornewmeal + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
