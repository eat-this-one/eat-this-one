angular.module('eat-this-one')
    .factory('editDishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, dish) {

        var method = '';
        if (typeof dish.id != 'undefined' && dish.id != null) {
            method = 'PUT';
        } else {
            method = 'POST';
        }

        // Adding the session token to the request.
        dish.token = sessionManager.getToken();

        $http({
            method : method,
            url : eatConfig.backendUrl + '/dishes',
            data : dish

        }).success(function(data) {
            appStatus.completed();
            notifier.show($scope.lang.dishadded, 'success');

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = 'Dish can not be added/edited. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
        });
    };

}]);
