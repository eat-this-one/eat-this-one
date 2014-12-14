angular.module('eat-this-one')
    .factory('mealsRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', 'datesConverter', 'newLogRequest', function($http, appStatus, notifier, eatConfig, sessionManager, datesConverter, newLogRequest) {

    return function($scope) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/meals',
            params : {
                token : sessionManager.getToken()
            }

        }).success(function(dishesData) {
            $scope.meals = dishesData;

            if ($scope.meals.length === 0) {
                $scope.showNoMeals = true;
            } else {
                for (index in $scope.meals) {
                    $scope.meals[index].when = datesConverter.timeToDay(Date.parse($scope.meals[index].when));
                }
            }

            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {

            // On unauthorized access we redirect to the index.
            if (errorStatus === 401) {
                newLogRequest('redirected', 'index', 'meals-index');
                window.location.href = 'index.html';
            } else {
                appStatus.completed();
                var msg = $scope.lang.errormealrequest + '. "' + errorStatus + '": ' + data;
                notifier.show($scope.lang.error, msg, 'error');
            }
        });
    };

}]);
