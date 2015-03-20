angular.module('eat-this-one')
    .controller('DishesShareController', ['$scope', 'authManager', 'redirecter', 'eatConfig', 'urlParser', 'shareManager', 'newLogRequest', 'menuManager', 'appStatus', function($scope, authManager, redirecter, eatConfig, urlParser, shareManager, newLogRequest, menuManager, appStatus) {

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
        menuManager.dishesListItem(),
        menuManager.locationViewItem(),
        menuManager.feedbackItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    // Set the loading here as getting contacts may be slow.
    // We do it here so we don't even display the info text
    // before all is ready.
    appStatus.waiting('contacts');

    var loc = JSON.parse(localStorage.getItem('loc'));
    $scope.infomessage = $scope.lang.messagecontactsinfo + ' "' + loc.code + '"';

    // Allow shareManager services to inject a contacts list here.
    $scope.contacts = [];

    newLogRequest('view', 'dishes-share');

    // Initializes the share manager (loads phone contacts if necessary...).
    shareManager.init($scope);

    $scope.share = function() {

        // The receiver already knows who is sending the message.
        var msg = $scope.lang.inviteimcooking + ' ' + urlParser.getParam('dishname') + '. ' +
             $scope.lang.invitejoindetailsbook + '. ' + $scope.lang.invitegroupcode +
             ': "' + loc.code + '". ' + eatConfig.downloadAppUrl;

        shareManager.process($scope, msg);
    };
}]);
