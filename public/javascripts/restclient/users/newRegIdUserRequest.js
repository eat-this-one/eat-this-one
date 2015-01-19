angular.module('eat-this-one')
    .factory('newRegIdUserRequest', ['redirecter', '$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', 'newLogRequest', function(redirecter, $http, appStatus, notifier, eatConfig, authManager, sessionManager, newLogRequest) {

    return function($scope) {

        var requestData = {
            provider : 'regid',
            name : $scope.name.value,
            email : $scope.email.value,
            gcmregid : localStorage.getItem('gcmRegId')
        };

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/users',
            data : requestData
        }).success(function(data) {

            authManager.authenticate(data.id);
            sessionManager.setUser(data);

            newLogRequest('created', 'account', data.id);

            redirecter.redirect('location-subscriptions/edit.html');

            // I don't think we will never reach that point but anyway,
            // just closing what was opened.
            appStatus.completed('signup');

        }).error(function(data, errorStatus, errorMsg) {

            appStatus.completed('signup');
            newLogRequest('error', 'create-account', errorMsg);

            var msg = $scope.lang.errornewuser + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
