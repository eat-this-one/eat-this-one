angular.module('eat-this-one')
    .factory('OAuthUserRequest', ['redirecter', '$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', 'newLogRequest', function(redirecter, $http, appStatus, notifier, eatConfig, authManager, sessionManager, newLogRequest) {

    return {

        google : function($scope, googleCode) {

            var requestData = {
                provider : 'google',
                code : googleCode,
                gcmregid : localStorage.getItem('gcmRegId')
            };

            $http({
                method : 'POST',
                url : eatConfig.backendUrl + '/users',
                data : requestData
            }).success(function(data) {

                authManager.authenticate(data.id);
                sessionManager.setUser(data);

                newLogRequest('created', 'account');
                appStatus.completed('signin');

                redirecter.redirect('location-subscriptions/edit.html');

            }).error(function(data, errorStatus, errorMsg) {
                appStatus.completed('signin');
                var msg = $scope.lang.errornewuser + '. "' + errorStatus + '": ' + data;
                notifier.show($scope.lang.error, msg, 'error');
            });
        }

    };

}]);
