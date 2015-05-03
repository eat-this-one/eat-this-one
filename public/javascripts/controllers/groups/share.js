angular.module('eat-this-one')
    .controller('GroupsShareController', ['$scope', 'authManager', 'redirecter', 'eatConfig', 'shareManager', 'newLogRequest', 'menuManager', 'appStatus', function($scope, authManager, redirecter, eatConfig, shareManager, newLogRequest, menuManager, appStatus) {

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
            icon : 'glyphicon glyphicon-send',
            callback : 'share'
        }
    ];
    $scope.menuItems = menuManager.getDefaultItems();

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    // Set the loading here as getting contacts may be slow.
    // We do it here so we don't even display the info text
    // before all is ready.
    appStatus.waiting('contacts');

    // TODO We will need to change this when we accept more than 1 group as
    // we should request id param group data.
    var group = JSON.parse(localStorage.getItem('group'));
    $scope.infomessage = $scope.lang.messagecontactsinfo + ' ';
    $scope.code = group.code;

    // Allow shareManager services to inject a contacts list here.
    $scope.contacts = [];

    newLogRequest('view', 'groups-share');

    // Initializes the share manager (loads phone contacts if necessary...).
    shareManager.init($scope);

    $scope.share = function() {

        var msg = $scope.lang.invitejoinmygroup + ' .' + $scope.lang.invitegroupcode +
             ': "' + group.code + '". ' + eatConfig.downloadAppUrl;
        shareManager.process($scope, msg);
    };
}]);
