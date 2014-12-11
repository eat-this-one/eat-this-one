angular.module('eat-this-one')
    .controller('DishesEditController', ['$scope', '$window', 'appStatus', 'urlParser', 'dishRequest', 'editDishRequest', 'eatConfig', 'authManager', 'datesConverter', 'newLogRequest', function($scope, $window, appStatus, urlParser, dishRequest, editDishRequest, eatConfig, authManager, datesConverter, newLogRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.adddish;

    // Declare form fields.
    $scope.photo = {
        value: '',
    };
    $scope.name = {
        name: 'name',
        label: $scope.lang.dishname,
        placeholder: $scope.lang.dishnameexample,
        value: ''
    };
    $scope.description = {
        name: 'description',
        label: $scope.lang.dishdescription,
        placeholder: $scope.lang.dishdescriptionexample,
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
        value: 'tomorrow',
        options: [
            {text: $scope.lang.today, value: 'today', btnstyle: 'btn-warning'},
            {text: $scope.lang.tomorrow, value: 'tomorrow', btnstyle: 'btn-success active'},
            {text: $scope.lang.aftertomorrow, value: 'aftertomorrow', btnstyle: 'btn-info'}
        ]
    };
    $scope.nportions = {
        name: 'nportions',
        label: $scope.lang.nportions,
        value: 0,
        options: [
            {text : 1, value : 1, btnstyle: 'btn-info'},
            {text : 2, value : 2, btnstyle: 'btn-info'},
            {text : 3, value : 3, btnstyle: 'btn-info'},
            {text : 4, value : 4, btnstyle: 'btn-info'},
            {text : $scope.lang.unlimited, value : 0, btnstyle: 'btn-warning active'}
        ]
    };
    $scope.donation = {
        name: 'donation',
        label: $scope.lang.expecteddonation,
        value: 'open',
        options: [
            {text : $scope.lang.open, value : 'open', btnstyle: 'btn-success active'},
            {text : $scope.lang.nothing, value : 'nothing', btnstyle: 'btn-success'},
            {text : 1, value : '1', btnstyle: 'btn-warning'},
            {text : 2, value : '2', btnstyle: 'btn-warning'},
            {text : 3, value : '3', btnstyle: 'btn-warning'},
            {text : 4, value : '4', btnstyle: 'btn-warning'},
            {text : 5, value : '5', btnstyle: 'btn-warning'}
        ]
    };

    // For updates.
    var id = urlParser.getParam('id');

    // We only support having one location subscription.
    // No security issues on having the location in localStorage
    // as the locations info is public.
    var loc = localStorage.getItem('loc');
    if (!loc) {
        newLogRequest('redirected', 'locationSubscriptions-add', 'index');
        $window.location.href = 'location-subscriptions/edit.html';
    }
    var locationInstance = JSON.parse(loc);
    $scope.locationid.value = locationInstance._id;

    // Load the dish info.
    if (id) {
        appStatus.waiting('dishRequest');
        dishRequest($scope, id);

        newLogRequest('view', 'dishes-edit', id);
    } else {
        // Just log the action.
        newLogRequest('view', 'dishes-add');
    }

    $scope.isEditing = function() {
        return (id);
    };

    $scope.save = function() {

        // Dish obj cleaning delegated to backend.
        var fields = [
            'name', 'description', 'locationid',
            'nportions', 'donation'];

        var dish = {};

        // Edit mode.
        if (id) {
            dish.id = id;
        }

        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        // Adding the base64 photo.
        dish.photo = $scope.photo.value;

        // When.
        dish.when = datesConverter.dayToTime($scope.when.value);

        appStatus.waiting();
        editDishRequest($scope, dish);

        if (id) {
            newLogRequest('click', 'dishes-edit-confirm');
        } else {
            newLogRequest('click', 'dishes-add-confirm');
        }
    };

}]);
