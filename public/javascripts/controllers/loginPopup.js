angular.module('eat-this-one').controller('loginPopupController', ['$scope', '$modalInstance', 'eatConfig', function($scope, $modalInstance, eatConfig) {

    $scope.lang = $.eatLang[eatConfig.lang];

    $scope.email = {
        name: 'email',
        label: $scope.lang.email,
        placeholder: $scope.lang.email,
        value: ''
    };

    $scope.password = {
        name: 'password',
        label: $scope.lang.password,
        placeholder: $scope.lang.password,
        value: ''
    };

    $scope.login = function() {
        $modalInstance.close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
