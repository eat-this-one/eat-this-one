angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'newLogRequest', function(eatConfig, appStatus, notifier, newLogRequest) {

    return {

        share : function(msg) {
            window.plugins.socialsharing.share(msg);
        }
    };
}]);
