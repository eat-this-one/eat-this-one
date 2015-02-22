angular.module('eat-this-one')
    .factory('updateRegIdRequest', ['$http', 'eatConfig', 'sessionManager', function($http, eatConfig, sessionManager) {

    return function() {

        var user = sessionManager.getUser();
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
