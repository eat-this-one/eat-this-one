angular.module('eat-this-one').run(['sessionManager', function(sessionManager) {
    sessionManager.initSession();
}]);
