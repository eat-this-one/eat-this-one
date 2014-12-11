angular.module('eat-this-one')
    .factory('OAuthUserRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, authManager, sessionManager) {

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

                authManager.authenticate();
                sessionManager.setUser(data);

                appStatus.completed('signin');

                $window.location.href = 'location-subscriptions/edit.html';

            }).error(function(data, errorStatus, errorMsg) {
                appStatus.completed('signin');
                var msg = $scope.lang.errornewuser + '. "' + errorStatus + '": ' + data;
                notifier.show($scope.lang.error, msg, 'error');
            });
        }

    };

}]);
