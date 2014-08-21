angular.module('eat-this-one')
    .factory('editDishRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

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
            notifier.show($scope.lang.dishadded, $scope.lang.dishaddedinfo, 'success');

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = 'Dish can not be added/edited. "' + errorStatus + '": ' + errorMsg;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
