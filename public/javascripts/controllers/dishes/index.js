angular.module('eat-this-one')
    .controller('DishesController', ['$scope', 'appStatus', 'urlParser', 'dishesRequest', 'eatConfig', function($scope, appStatus, urlParser, dishesRequest, eatConfig) {

    $scope.pageTitle = 'Dishes';
    $scope.lang = $.eatLang.lang;

    $scope.dishes = [];

    var params = {
        'where' : urlParser.getParam('where'),
        'when' : urlParser.getParam('when')
    };

    appStatus.waiting();
    dishesRequest($scope, params);
}]);
