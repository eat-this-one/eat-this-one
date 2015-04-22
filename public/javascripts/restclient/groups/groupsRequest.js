angular.module('eat-this-one')
    .factory('groupsRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, params, groupCallback, errorCallback) {

        params.token = sessionManager.getToken();

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/groups',
            params : params

        }).success(groupCallback).error(errorCallback);
    };
}]);
