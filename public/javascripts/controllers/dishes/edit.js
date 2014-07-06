angular.module('eat-this-one')
    .controller('DishesEditController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', 'eatConfig', 'eatAuth', function($scope, appStatus, urlParser, dishRequest, editDishRequest, eatConfig, eatAuth) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang[eatConfig.lang];
    $scope.auth = eatAuth;

    $scope.dish = {};

    // Declare form fields.
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
        value: new Date()
    };
    $scope.to = {
        name: 'to',
        label: $scope.lang.to,
        placeholder: $scope.lang.to,
        value: ''
    };
    $scope.nportions = {
        name: 'nportions',
        label: $scope.lang.nportions,
        value: 1
    };
    $scope.donation = {
        name: 'donation',
        label: $scope.lang.expecteddonation,
        value: ''
    };

    // Arguments.
    var id = urlParser.getParam('id');

    var where = urlParser.getParam('where');
    if (where) {
        $scope.where.value = where;
    }

    // We push the value as from.
    var when = urlParser.getParam('when');
    if (when) {
        $scope.from.value = new Date(parseInt(when));
    }

    // Setting 'to' to 'from' + 1h.
    $scope.to.value = new Date($scope.from.value.getTime() + (3600 * 1000));

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
        var fields = [
            'name', 'description', 'user', 'where',
            'from', 'to', 'nportions', 'donation'];
        var dish = {};
        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        appStatus.waiting();
        editDishRequest($scope, dish);
    };
}]);
