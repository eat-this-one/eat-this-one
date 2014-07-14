angular.module('eat-this-one')
    .controller('DishesEditController', ['$scope', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', 'eatConfig', 'authManager', function($scope, appStatus, urlParser, dishRequest, editDishRequest, eatConfig, authManager) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    $scope.loginButtonsLangStrings = {
        signin : $scope.lang.signintoadd,
        signup : $scope.lang.signuptoadd
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
    $scope.loc = {
        name: 'loc',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: ''
    };
    $scope.address = {
        name: 'address',
        label: $scope.lang.address,
        placeholder: $scope.lang.address,
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

    // Load the dish info.
    if (id) {
        appStatus.waiting();
        dishRequest($scope, id);
    }

    $scope.save = function() {

        // Dish obj cleaning delegated to backend.
        var fields = [
            'name', 'description', 'loc', 'address',
            'from', 'to', 'nportions', 'donation'];
        var dish = {};
        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        appStatus.waiting();
        editDishRequest($scope, dish);
    };

}]);
