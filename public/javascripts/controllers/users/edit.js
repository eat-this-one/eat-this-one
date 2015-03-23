angular.module('eat-this-one')
    .controller('UsersEditController',
        ['$scope', 'redirecter', 'appStatus', 'sessionManager', 'notifier', 'eatConfig', 'authManager', 'formsManager', 'newLogRequest', 'menuManager', 'editApnTokenUserRequest', 'editRegIdUserRequest',
        function($scope, redirecter, appStatus, sessionManager, notifier, eatConfig, authManager, formsManager, newLogRequest, menuManager, editApnTokenUserRequest, editRegIdUserRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.editprofile;
    $scope.actionIcons = [
        {
            name : $scope.lang.save,
            icon : 'glyphicon glyphicon-ok',
            callback : 'save'
        }
    ];
    $scope.menuItems = [
        menuManager.dishAddItem(),
        menuManager.editProfileItem(),
        menuManager.dishesListItem(),
        menuManager.locationViewItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    var user = sessionManager.getUser();

    // Declare form fields.
    $scope.name = {
        name: 'name',
        label: $scope.lang.username,
        placeholder: $scope.lang.usernameexample,
        validation: ['required', 'text'],
        value: user.name
    };
    $scope.email = {
        name: 'email',
        label: $scope.lang.email,
        placeholder: $scope.lang.emailexample,
        validation: ['required', 'email'],
        value: user.email
    };

    $scope.save = function() {

        newLogRequest('click', 'user-edit');

        // Validate the form text forms, the other ones have a default value.
        if (!formsManager.validate(['name', 'email'], $scope)) {
            notifier.show($scope.lang.missingfields, $scope.lang.missingfieldsinfo);
            return;
        }

        appStatus.waiting('updateProfile');

        if (localStorage.getItem('gcmRegId') !== null) {
            editRegIdUserRequest(
                $scope,
                'index.html',
                'updated',
                'update-account'
            );
        } else if (localStorage.getItem('apnToken') !== null) {
            editApnTokenUserRequest(
                $scope,
                'index.html',
                'updated',
                'update-account'
            );
        } else {
            newLogRequest('error', 'user-edit', 'nor gcmRegId nor apnToken');
            notifier.show($scope.lang.error, $scope.lang.weird);
        }
    };
}]);
