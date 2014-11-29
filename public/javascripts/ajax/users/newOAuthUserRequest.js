angular.module('eat-this-one')
    .factory('newOAuthUserRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, authManager, sessionManager) {

    return {
    
        google : function($scope, googleCode) {

            // Using the website nothing will be send.
            var gcmregid = localStorage.getItem('gcmRegId');

            var requestData = {
                provider : 'google',
                code : googleCode,
                gcmregid : gcmregid
            };

            this.sendRequest($scope, requestData);
        },

        // Internal method used by the authentication methods.
        sendRequest : function($scope, requestData) {
            $http({
                method : 'POST',
                url : eatConfig.backendUrl + '/users',
                data : requestData
            }).success(function(data) {

                authManager.authenticate();
                sessionManager.setUser(data);

                notifier.show($scope.lang.accountcreated, $scope.lang.accountcreatedinfo, 'success');

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
