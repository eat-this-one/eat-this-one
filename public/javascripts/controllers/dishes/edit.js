angular.module('eat-it')
    .controller('dishesEditController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', function($scope, appStatus, urlParser, dishRequest, editDishRequest) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    var id = urlParser.getParam('id');

    // Load the dish info.
    appStatus.waiting();
    dishRequest($scope, id);

    $scope.save = function() {

        // TODO Probably some dish cleaning will be required.
        var dish = $scope.dish;
        dish.from = new Date(2014, 06, 06, 14, 30, 00);
        dish.to = new Date(2014, 06, 06, 15, 30, 00);

        appStatus.waiting();
        editDishRequest($scope, dish);
    };
}]);
