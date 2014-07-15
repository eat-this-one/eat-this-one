angular.module('eat-this-one')
    .factory('dishRequest', ['appStatus', 'notifier', 'eatConfig', 'mapsManager', function(appStatus, notifier, eatConfig, mapsManager) {

    return function($scope, id) {

        $.ajax({
            type : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id,
            datatype : 'json',
            success : function(dishData) {
                $scope.dish = dishData;
                $scope.dish.map = mapsManager.getStaticMap($scope.dish.loc.address);

                $scope.$apply();
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Dish data can not be obtained. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
