angular.module('eat-this-one').controller('signUpPopupController', ['$scope', '$modalInstance', 'eatConfig', function($scope, $modalInstance, eatConfig) {

    $scope.lang = $.eatLang[eatConfig.lang];

    $scope.name = {
        name: 'name',
        label: $scope.lang.name,
        placeholder: $scope.lang.name,
        value: ''
    };

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

    // TODO: Request to create user.
    $scope.signup = function() {
        $modalInstance.close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
