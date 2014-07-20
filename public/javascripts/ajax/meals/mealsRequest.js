angular.module('eat-this-one')
    .factory('mealsRequest', ['appStatus', 'notifier', 'eatConfig', 'sessionManager', function(appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, params) {

        if (params === null) {
            params = {};
        }

        $.ajax({
            type : 'GET',
            url : eatConfig.backendUrl + '/meals',
            data : {
                token : sessionManager.getToken()
            },
            datatype : 'json',
            success : function(dishesData) {
                $scope.meals = dishesData;
                $scope.$apply();
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Meals data can not be obtained. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
