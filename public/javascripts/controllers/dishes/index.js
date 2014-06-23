angular.module('eat-it')
    .controller('dishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', function($scope, appStatus, urlParser, dishesRequest) {

    $scope.pageTitle = 'Dishes';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    var params = {
        'where' : urlParser.getParam('where'),
        'when' : urlParser.getParam('when')
    };

    appStatus.waiting();
    dishesRequest($scope, params);
}]);
