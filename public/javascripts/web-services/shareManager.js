angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'newLogRequest', function(eatConfig, appStatus, notifier, newLogRequest) {

    return {

        share : function(msg) {
            window.location.href = 'mailto:?to=&body=' + msg;
        }
    };
}]);
