angular.module('eat-this-one')
    .factory('newLocationRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, name, address) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/locations',
            data : {
                name : name,
                address : address,
                token : sessionManager.getToken()
            }

        }).success(function(data) {

            var msg = $scope.lang.locationcreatedinfo + "\n\n" + $scope.lang.subscribedlocationinfo;
            notifier.show($scope.lang.locationcreated, msg, 'success');

            appStatus.completed('newLocationRequest');

            // Cache the location.
            localStorage.setItem('loc', JSON.stringify(data));

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed('newLocationRequest');
            var msg = '"' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };
}]);
