angular.module('eat-this-one')
    .controller('LocationsShareController', ['$scope', 'authManager', 'redirecter', 'eatConfig', 'shareManager', 'newLogRequest', 'menuManager', 'appStatus', function($scope, authManager, redirecter, eatConfig, shareManager, newLogRequest, menuManager, appStatus) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.invitepeople;
    $scope.actionIcons = [
        {
            name : $scope.lang.message,
            icon : 'glyphicon glyphicon-envelope',
            callback : 'share'
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

    // Set the loading here as getting contacts may be slow.
    // We do it here so we don't even display the info text
    // before all is ready.
    appStatus.waiting('contacts');

    // TODO We will need to change this when we accept more than 1 group as
    // we should request id param location data.
    var loc = JSON.parse(localStorage.getItem('loc'));
    $scope.infomessage = $scope.lang.messagecontactsinfo + ' ';
    $scope.code = loc.code;

    // Allow shareManager services to inject a contacts list here.
    $scope.contacts = [];

    newLogRequest('view', 'locations-share');

    // Initializes the share manager (loads phone contacts if necessary...).
    shareManager.init($scope);

    $scope.share = function() {

        var msg = $scope.lang.invitejoinmygroup + ' .' + $scope.lang.invitegroupcode +
             ': "' + loc.name + '". ' + eatConfig.downloadAppUrl;
        shareManager.process($scope, msg);
    };
}]);
