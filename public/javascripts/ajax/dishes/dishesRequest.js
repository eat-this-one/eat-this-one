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

        }).error(function(data, errorStatus, errorMsg) {
            var msg = 'Dishes data can not be obtained. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
            appStatus.completed();
        });
    };

}]);
