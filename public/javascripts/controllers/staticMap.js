angular.module('eat-this-one')
    .controller('staticMapController', ['$scope', 'dish', 'eatConfig', '$mdDialog', 'newLogRequest', function($scope, dish, eatConfig, $mdDialog, newLogRequest) {

        $scope.lang = $.eatLang.lang;
        $scope.dish = dish;

        $scope.close = function() {
            $mdDialog.cancel();
        };

        newLogRequest('view', 'static-map');
}]);
