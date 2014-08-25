angular.module('eat-this-one')
    .factory('mealsRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/meals',
            params : {
                token : sessionManager.getToken()
            }

        }).success(function(dishesData) {
            $scope.meals = dishesData;

            appStatus.completed();

            if ($scope.meals.length === 0) {
                $scope.showNoMeals = true;
            }

        }).error(function(data, errorStatus, errorMsg) {

            // On unauthorized access we redirect to the index.
            if (errorStatus === 401) {
                window.location.href = 'index.html';
            } else {
                appStatus.completed();
                var msg = 'Meals data can not be obtained. "' + errorStatus + '": ' + errorMsg;
                notifier.show($scope.lang.error, msg, 'error');
            }
        });
    };

}]);
