angular.module('eat-this-one').controller('signInPopupController', ['$scope', '$modalInstance', 'eatConfig', 'appStatus', 'loginRequest', function($scope, $modalInstance, eatConfig, appStatus, loginRequest) {

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

    $scope.signin = function() {
        appStatus.waiting();
        loginRequest($scope, $modalInstance, $scope.email.value, $scope.password.value);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}]);
