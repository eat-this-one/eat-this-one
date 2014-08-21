angular.module('eat-this-one')
    .factory('dishesRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', function($http, appStatus, notifier, eatConfig) {

    return function($scope, params) {

        if (params === null) {
            params = {};
        }

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes',
            params : params

        }).success(function(dishesData) {
            $scope.dishes = dishesData;

            appStatus.completed();

            if ($scope.dishes.length === 0) {
                $scope.showNoDishes = true;
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = 'Dishes data can not be obtained. "' + errorStatus + '": ' + errorMsg;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
