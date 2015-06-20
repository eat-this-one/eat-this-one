angular.module('eat-this-one')
    .factory('deleteGroupMemberRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'notifier', function(redirecter, $http, eatConfig, sessionManager, appStatus) {

    return function($scope, groupid) {

        $http({
            method : 'DELETE',
            url : eatConfig.backendUrl + '/group-members/' + groupid,
            data : {
                token : sessionManager.getToken()
            }

        }).success(function() {
            localStorage.removeItem('group');
            redirecter.redirect('index.html');
        }).error(function() {
            notifier.show($scope.lang.error, $scope.lang.weird);
        });
    };
}]);
