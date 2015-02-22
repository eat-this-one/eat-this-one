angular.module('eat-this-one')
    .factory('updateRegIdRequest', ['$http', 'eatConfig', 'sessionManager', 'newLogRequest', function($http, eatConfig, sessionManager, newLogRequest) {

    return function() {

        // We need to check that there is a user because on the app
        // when we set the registration id we don't now if the user
        // is already set or not.
        var user = sessionManager.getUser();
        if (user === null) {
            return;
        }

        var requestData = {
            provider : 'regid',
            token : sessionManager.getToken(),
            gcmregid : localStorage.getItem('gcmRegId')
        };

        $http({
            method : 'PUT',
            url : eatConfig.backendUrl + '/users/' + user.id,
            data : requestData
        })
        .success(function(data) {
            // We do nothing here.
        })
        .error(function(data, errorStatus, errorMsg) {
            newLogRequest('error', 'update-token', errorMsg);
        });
    };

}]);
