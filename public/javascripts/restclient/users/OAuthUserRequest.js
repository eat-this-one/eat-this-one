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

                redirecter.redirect('location-subscriptions/edit.html');

                // I don't think we will never reach that point but anyway,
                // just closing what was opened.
                appStatus.completed('signin');

            }).error(function(data, errorStatus, errorMsg) {
                appStatus.completed('signin');
                var msg = $scope.lang.errornewuser + '. "' + errorStatus + '": ' + data;
                notifier.show($scope.lang.error, msg);
            });
        }

    };

}]);
