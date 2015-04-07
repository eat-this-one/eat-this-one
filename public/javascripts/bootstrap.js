// AngularJS app declaration.
angular.module('eat-this-one', ['ngMaterial', 'ngTouch', 'angular-md5']);

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

angular.module('eat-this-one')
    .config(['$mdThemingProvider', function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('light-green', {
            'default': '300'
        });
    }]);
