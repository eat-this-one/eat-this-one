angular.module('eat-this-one').controller('signUpPopupController', ['$scope', '$modalInstance', 'eatConfig', 'appStatus', 'newUserRequest', function($scope, $modalInstance, eatConfig, appStatus, newUserRequest) {

    $scope.lang = $.eatLang.lang;

    $scope.name = {
        name: 'name',
        label: $scope.lang.yourname,
        placeholder: $scope.lang.nameexample,
        value: ''
    };

    $scope.email = {
        name: 'email',
        label: $scope.lang.youremail,
        placeholder: $scope.lang.emailexample,
        value: ''
    };

    $scope.password = {
        name: 'password',
        label: $scope.lang.newpassword,
        placeholder: $scope.lang.passwordexample,
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
