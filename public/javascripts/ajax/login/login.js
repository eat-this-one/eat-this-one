angular.module('eat-this-one')
    .factory('loginRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', function($http, appStatus, notifier, eatConfig, authManager, sessionManager) {

    return function($scope, $modalInstance, email, password) {

        // Using the website nothing will be send.
        var gcmregid = localStorage.getItem('gcmRegId');

        var requestData = {
            email : email,
            password : password,
            gcmregid : gcmregid
        };

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/login',
            data : requestData

        }).success(function(data) {

            authManager.authenticate();
            sessionManager.setUser(data);

            $modalInstance.close(true);

            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            notifier.show(errorMsg, 'error');
        });
    };

}]);
