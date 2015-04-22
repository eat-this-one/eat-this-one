angular.module('eat-this-one')
    .factory('newGroupMemberRequest', ['redirecter', '$http', 'eatConfig', 'statics', 'sessionManager', 'appStatus', 'notifier', function(redirecter, $http, eatConfig, statics, sessionManager, appStatus, notifier) {

    return function($scope, groupid, groupMembershipCallback, errorCallback) {

        var message = sessionManager.getUser().name + ' ' +
            $.eatLang.lang.lnjoined;

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/group-members',
            data : {
                groupid : groupid,
                token : sessionManager.getToken(),
                message : message
            }

        }).success(groupMembershipCallback).error(errorCallback);
    };
}]);
