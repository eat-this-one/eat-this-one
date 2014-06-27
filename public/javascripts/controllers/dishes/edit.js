angular.module('eat-this-one')
    .controller('dishesEditController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', function($scope, appStatus, urlParser, dishRequest, editDishRequest) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    $scope.dish = {};

    // Arguments.
    var id = urlParser.getParam('id');

    var where = urlParser.getParam('where');
    if (where) {
        $scope.dish.where = where;
    }

    // We push the value as from.
    var when = urlParser.getParam('when');
    if (when) {
        $scope.dish.from = when;
    }

    // Form fields.
    $scope.name = {
        name: 'name',
        label: $scope.lang.dishname,
        placeholder: $scope.lang.dishname,
        value: ''
    };
    $scope.description = {
        name: 'description',
        label: $scope.lang.dishdescription,
        placeholder: $scope.lang.dishdescription,
        value: ''
    };
    $scope.user = {
        name: 'user',
        label: $scope.lang.username,
        placeholder: $scope.lang.username,
        value: ''
    };
    $scope.where = {
        name: 'where',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: ''
    };
    $scope.from = {
        name: 'from',
        label: $scope.lang.from,
        placeholder: $scope.lang.from,
        value: ''
    };
    $scope.to = {
        name: 'to',
        label: $scope.lang.to,
        placeholder: $scope.lang.to,
        value: ''
    };

    $scope.donationValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];
    $scope.nportionsValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Load the dish info.
    if (id) {
        // TODO: Check that the user is the owner
        appStatus.waiting();
        dishRequest($scope, id);
    }

    $scope.save = function() {

        // TODO Probably some dish cleaning will be required.
        var dish = $scope.dish;

        appStatus.waiting();
        editDishRequest($scope, dish);
    };
}]);
