angular.module('eat-this-one')
    .factory('groupMembersRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'newLogRequest', 'notifier', function(redirecter, $http, eatConfig, sessionManager, appStatus, newLogRequest, notifier) {

    return function($scope, groupMembersCallback, errorCallback) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/group-members',
            params : {
                token : sessionManager.getToken()
            }

        })
        .success(groupMembersCallback)
        .error(errorCallback);
    };
}]);
