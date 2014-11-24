angular.module('eat-this-one')
    .factory('dishesRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', 'datesConverter', function($http, appStatus, notifier, eatConfig, sessionManager, datesConverter) {

    return function($scope) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes',
            params : { token : sessionManager.getToken() }

        }).success(function(dishesData) {
            $scope.dishes = dishesData;

            appStatus.completed();

            if ($scope.dishes.length === 0) {
                $scope.showNoDishes = true;
            } else {
                for (index in $scope.dishes) {
                    $scope.dishes[index].when = datesConverter.timeToDay(Date.parse($scope.dishes[index].when));
                }
            }

        }).error(function(data, errorStatus, errorMsg) {

            // On unauthorized access we redirect to the index.
            if (errorStatus === 401) {
                window.location.href = 'index.html';
            } else {
                appStatus.completed();
                var msg = $scope.lang.errordishesrequest + '. "' + errorStatus + '": ' + data;
                notifier.show($scope.lang.error, msg, 'error');
            }
        });
    };

}]);
