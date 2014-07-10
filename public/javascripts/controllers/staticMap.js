angular.module('eat-this-one')
    .controller('staticMapController', ['$scope', 'eatConfig', '$modalInstance', 'dish', function($scope, eatConfig, $modalInstance, dish) {

        $scope.lang = $.eatLang.lang;
        $scope.dish = dish;

        $scope.close = function() {
            $modalInstance.close();
        };
}]);
