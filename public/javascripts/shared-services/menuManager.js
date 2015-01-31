angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', function($mdSidenav) {
    return {
        toggle : function() {
            $mdSidenav('menu').toggle();
        }
    };
}]);
