angular.module('eat-this-one')
    .factory('newGroupRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, name, country, groupCallback, errorCallback) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/groups',
            data : {
                name : name,
                country : country,
                token : sessionManager.getToken()
            }

        }).success(groupCallback).error(errorCallback);
    };
}]);
