angular.module('eat-this-one')
    .controller('DishesEditController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', 'locationSubscriptionsRequest', 'eatConfig', 'authManager', function($scope, appStatus, urlParser, dishRequest, editDishRequest, locationSubscriptionsRequest, eatConfig, authManager) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    $scope.loginButtonsLangStrings = {
        signin : $scope.lang.signintoadddish,
        signup : $scope.lang.signuptoadddish
    };

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
    $scope.locationid = {
        name: 'locationid',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: '',
        options: []
    };
    $scope.from = {
        name: 'from',
        label: $scope.lang.from,
        placeholder: $scope.lang.from,
        value: new Date()
    };
    $scope.nportions = {
        name: 'nportions',
        label: $scope.lang.nportions,
        value: 1,
        options: [
            {text : 1, value : 1},
            {text : 2, value : 2},
            {text : 3, value : 3},
            {text : 4, value : 4},
            {text : 5, value : 5},
            {text : 6, value : 6},
            {text : 7, value : 7},
            {text : 8, value : 8},
        ]
    };
    $scope.donation = {
        name: 'donation',
        label: $scope.lang.expecteddonation,
        value: '',
        options: [
            {text : $scope.lang.open, value : 'open'},
            {text : $scope.lang.nothing, value : 'nothing'},
            {text : 1, value : 1},
            {text : 2, value : 2},
            {text : 3, value : 3},
            {text : 4, value : 4},
            {text : 5, value : 5}
        ]
    };

    // TODO This will be used for update.
    // Arguments.
    var id = urlParser.getParam('id');

    // Load the user subscriptions.
    appStatus.waiting();
    locationSubscriptionsRequest($scope);

    // Load the dish info.
    if (id) {
        appStatus.waiting();
        dishRequest($scope, id);
    }

    $scope.save = function() {

        // Dish obj cleaning delegated to backend.
        var fields = [
            'name', 'description', 'locationid',
            'from', 'nportions', 'donation'];

        var dish = {};
        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        appStatus.waiting();
        editDishRequest($scope, dish);
    };

}]);
