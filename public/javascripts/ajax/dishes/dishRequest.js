angular.module('eat-this-one')
    .factory('dishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'mapsManager', function($http, appStatus, notifier, eatConfig, mapsManager) {

    return function($scope, id) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id

        }).success(function(dishData) {
            $scope.dish = dishData;
            $scope.dish.map = mapsManager.getStaticMap($scope.dish.loc.address);

            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = 'Dish data can not be obtained. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
        });
    };

}]);
