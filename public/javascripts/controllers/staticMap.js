angular.module('eat-this-one')
    .controller('staticMapController', ['$scope', 'dish', 'eatConfig', '$modalInstance', 'newLogRequest', function($scope, dish, eatConfig, $modalInstance, newLogRequest) {

        $scope.lang = $.eatLang.lang;
        $scope.dish = dish;

        $scope.close = function() {
            $modalInstance.close();
        };

        newLogRequest('view', 'static-map');
}]);
