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
            var msg = 'Account successfully created';
            notifier.show(msg, 'success');

            authManager.authenticate();
            sessionManager.setUser(data);

            appStatus.completed();
            $modalInstance.close(true);

            $window.location.href = 'location-subscriptions/edit.html';

        }).error(function(data, errorStatus, errorMsg) {
                notifier.show(errorMsg, 'error');
                appStatus.completed();
        });
    };

}]);
