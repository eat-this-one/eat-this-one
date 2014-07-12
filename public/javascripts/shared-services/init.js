angular.module('eat-this-one').run(['sessionManager', 'eatConfig', function(sessionManager, eatConfig) {

    // Init the session.
    sessionManager.initSession();

}]);
