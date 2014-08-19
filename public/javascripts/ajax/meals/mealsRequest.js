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

        }).error(function(data, errorStatus, errorMsg) {
            var msg = 'Meals data can not be obtained. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
            appStatus.completed();
        });
    };

}]);
