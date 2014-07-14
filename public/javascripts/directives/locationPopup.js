angular.module('eat-this-one').directive('eatLocationPopup', ['$http', 'eatConfig', function($http, eatConfig) {

    return {

        restrict: 'E',
        scope: {
            loc: '=',
            address: '='
        },
        link : function(scope) {

            scope.lang = $.eatLang.lang;

            scope.loc = {
                name: 'loc',
                label: scope.lang.where,
                placeholder: scope.lang.where,
                value: ''
            };
            scope.address = {
                name: 'address',
                label: scope.lang.address,
                placeholder: scope.lang.address,
                value: ''
            };

        },
        templateUrl: 'templates/location-popup.html'
    };

}]);
