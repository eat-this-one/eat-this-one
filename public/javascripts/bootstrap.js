// AngularJS app declaration.
angular.module('eat-this-one', ['ui.bootstrap']);

// Inits i18n object.
$.eatLang = {};

angular.module('eat-this-one')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common = {
            'Content-Type': 'application/json'
        };
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.delete = {};
}]);
