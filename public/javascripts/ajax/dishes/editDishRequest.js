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

            var info = $scope.lang.dishaddedinfo;

            // Adding more info if planning cooking was selected.
            if (data.nportions === 0) {
                info += "\n\n" + $scope.lang.planningcookingselected;
            }
            notifier.show($scope.lang.dishadded, info, 'success');

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errordishedit + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
