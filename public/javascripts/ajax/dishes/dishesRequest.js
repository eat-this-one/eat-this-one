angular.module('eat-this-one')
    .factory('dishesRequest', ['appStatus', 'notifier', 'eatConfig', function(appStatus, notifier, eatConfig) {

    return function($scope, params) {

        if (params === null) {
            params = {};
        }

        $.ajax({
            type : 'GET',
            url : eatConfig.backendUrl + '/dishes',
            data : params,
            datatype : 'json',
            success : function(dishesData) {
                $scope.dishes = dishesData;
                $scope.$apply();
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Dishes data can not be obtained. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
