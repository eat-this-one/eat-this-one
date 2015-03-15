angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'newLogRequest', function(eatConfig, appStatus, notifier, newLogRequest) {

    return {

        init : function($scope) {
            appStatus.completed('contacts');
        },

        process : function($scope, msg) {
            window.location.href = 'mailto:?to=&body=' + msg +
                '&subject=' + $scope.lang.inviteemailsubject;
        }
    };
}]);
