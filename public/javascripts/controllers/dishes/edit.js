angular.module('eat-it')
    .controller('dishesEditController', ['$scope', function($scope) {

    $scope.pageTitle = 'Edit dish';

    var id = $.urlParser.getParam('id');

    $scope.lang = {};
    $scope.lang.dishname = 'Dish name';
    $scope.lang.dishdescription = 'Description';
    $scope.lang.where = 'Where';
    $scope.lang.from = 'From';
    $scope.lang.to = 'To';
    $scope.lang.nportions = 'Number of portions';
    $scope.lang.expecteddonation = 'Expected donation';
    $scope.lang.open = 'Open';
    $scope.lang.nothing = 'Nothing';
    $scope.lang.aud = 'Australian Dolars';
    $scope.lang.savechanges = 'Save changes';

     // Load the dish info.
    $.appStatus.waiting();
    $.dishRequest($scope, id);

    $scope.save = function() {
        // TODO Probably some dish cleaning will be required.
        $.appStatus.waiting();
        $.editDishRequest($scope, dish);
    };
}]);
