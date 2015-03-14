angular.module('eat-this-one')
    .controller('DishesShareController', ['$scope', 'authManager', 'redirecter', 'eatConfig', 'urlParser', 'shareManager', 'newLogRequest', 'menuManager', function($scope, authManager, redirecter, eatConfig, urlParser, shareManager, newLogRequest, menuManager) {

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
        menuManager.dishesListItem(),
        menuManager.locationViewItem(),
        menuManager.bookedMealsItem(),
        menuManager.feedbackItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    var loc = JSON.parse(localStorage.getItem('loc'));
    $scope.infomessage = $scope.lang.messagecontactsinfo + ': "' + loc.name + '"';

    // Allow shareManager services to inject a contacts list here.
    $scope.contacts = [];

    newLogRequest('view', 'dishes-share');

    // Initializes the share manager (loads phone contacts if necessary...).
    shareManager.init($scope);

    $scope.share = function() {
        shareManager.process($scope);
    };
}]);
