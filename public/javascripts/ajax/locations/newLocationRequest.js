angular.module('eat-this-one')
    .factory('newLocationRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function(name, address) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/locations',
            data : {
                name : name,
                address : address,
                token : sessionManager.getToken()
            }

        }).success(function(data) {
            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            notifier.show($.eatLang.lang.error, errorMsg, 'error');
        });
    };
}]);
