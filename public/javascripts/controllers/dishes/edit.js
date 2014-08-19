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
    $scope.when = {
        name: 'when',
        label: $scope.lang.when,
        placeholder: $scope.lang.when,
        value: '',
        options: [
            {text: $scope.lang.today, value: 'today', btnstyle: 'btn-warning'},
            {text: $scope.lang.tomorrow, value: 'tomorrow', btnstyle: 'btn-success'},
            {text: $scope.lang.aftertomorrow, value: 'aftertomorrow', btnstyle: 'btn-info'}
        ]
    };
    $scope.nportions = {
        name: 'nportions',
        label: $scope.lang.nportions,
        value: 1,
        options: [
            {text : 1, value : 1, btnstyle: 'btn-info'},
            {text : 2, value : 2, btnstyle: 'btn-info'},
            {text : 3, value : 3, btnstyle: 'btn-info'},
            {text : 4, value : 4, btnstyle: 'btn-info'}
        ]
    };
    $scope.donation = {
        name: 'donation',
        label: $scope.lang.expecteddonation,
        value: '',
        options: [
            {text : $scope.lang.open, value : 'open', btnstyle: 'btn-success'},
            {text : $scope.lang.nothing, value : 'nothing', btnstyle: 'btn-success'},
            {text : 1, value : 1, btnstyle: 'btn-warning'},
            {text : 2, value : 2, btnstyle: 'btn-warning'},
            {text : 3, value : 3, btnstyle: 'btn-warning'},
            {text : 4, value : 4, btnstyle: 'btn-warning'},
            {text : 5, value : 5, btnstyle: 'btn-warning'}
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

        // TODO Transform when info today/tomorrow/aftertomorrow.
    }

    $scope.save = function() {

        // Dish obj cleaning delegated to backend.
        var fields = [
            'name', 'description', 'locationid',
            'nportions', 'donation'];

        var dish = {};
        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        // When.
        var now = new Date();
        // TODO Ensure that it is GMT 0 as we should always
        // work without timezone dependencies.
        var today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        switch ($scope.when.value) {
            case 'today':
                dish.when = today;
                break;
            case 'tomorrow':
                dish.when = today.getTime() + 24 * 60 * 60 * 1000;
                break;
            case 'aftertomorrow':
                dish.when = today.getTime() + 2 * 24 * 60 * 60 * 1000;
                break;
            default:
                dish.when = today;
                break;
        }

        appStatus.waiting();
        editDishRequest($scope, dish);
    };

}]);
