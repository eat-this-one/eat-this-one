// UNUSED
angular.module('eat-this-one')
    .factory('newUserRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, authManager, sessionManager) {

    return function($scope, $modalInstance, name, email, password) {

        // Using the website nothing will be send.
        var gcmregid = localStorage.getItem('gcmRegId');

        var requestData = {
            name : name,
            email : email,
            password : password,
            gcmregid : gcmregid
        };

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/users',
            data : requestData

        }).success(function(data) {

            authManager.authenticate();
            sessionManager.setUser(data);

            $modalInstance.close(true);
            notifier.show($scope.lang.accountcreated, $scope.lang.accountcreatedinfo, 'success');

            appStatus.completed();

            $window.location.href = 'location-subscriptions/edit.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errornewuser + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
