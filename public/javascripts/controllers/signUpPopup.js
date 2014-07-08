angular.module('eat-this-one').controller('signUpPopupController', ['$scope', '$modalInstance', 'eatConfig', 'appStatus', 'newUserRequest', function($scope, $modalInstance, eatConfig, appStatus, newUserRequest) {

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

    $scope.signup = function() {
        appStatus.waiting();
        newUserRequest($scope, $modalInstance, $scope.name.value, $scope.email.value, $scope.password.value);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
