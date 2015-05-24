angular.module('eat-this-one')
    .factory('updateApnTokenRequest', ['$http', 'eatConfig', 'sessionManager', 'newLogRequest', function($http, eatConfig, sessionManager, newLogRequest) {

    return function() {

        // We need to check that there is a user because on the app,
        // when we set the apn token we don't now if the user
        // is already set or not.
        var user = sessionManager.getUser();
        if (user === null) {
            return;
        }

        var requestData = {
            provider : 'apntoken',
            token : sessionManager.getToken(),
            apntoken : localStorage.getItem('apnToken')
        };

        $http({
            method : 'PUT',
            url : eatConfig.backendUrl + '/users/' + user._id,
            data : requestData
        })
        .success(function(data) {
            // We do nothing here.
        })
        .error(function(data, errorStatus, errorMsg) {
            newLogRequest('error', 'update-apn-token', errorMsg);
        });
    };

}]);
