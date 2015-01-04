angular.module('eat-this-one')
    .controller('DishesShareController', ['$scope', 'redirecter', 'eatConfig', 'urlParser', 'shareManager', 'newLogRequest', function($scope, redirecter, eatConfig, urlParser, shareManager, newLogRequest) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.invitepeople;

    var loc = JSON.parse(localStorage.getItem('loc'));
    $scope.infomessage = $scope.lang.messagecontactsinfo + ': "' + loc.name + '"';

    // Allow shareManager services to inject a contacts list here.
    $scope.contacts = [];

    newLogRequest('view', 'dishes-share');

    // Initializes the share manager (loads phone contacts if necessary...).
    shareManager.init($scope);

    $scope.noShare = function() {

        newLogRequest('click', 'dishes-share-continue');

        // TODO If there are no subscribers we should warn the
        // user that no users will see the dish he/she just added.
        redirecter.redirect('index.html');
    };

    $scope.share = function() {
        shareManager.process($scope);
    }
}]);
