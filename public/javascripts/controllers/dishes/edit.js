angular.module('eat-this-one')
    .controller('DishesEditController', ['$scope', 'redirecter', 'appStatus', 'urlParser', 'notifier', 'dishFormatter', 'dishRequest', 'editDishRequest', 'eatConfig', 'authManager', 'datesConverter', 'formsManager', 'newLogRequest', 'menuManager', 'statics',
    function($scope, redirecter, appStatus, urlParser, notifier, dishFormatter, dishRequest, editDishRequest, eatConfig, authManager, datesConverter, formsManager, newLogRequest, menuManager, statics) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.adddish;
    $scope.actionIcons = [
        {
            name : $scope.lang.save,
            icon : 'glyphicon glyphicon-ok',
            callback : 'save'
        }
    ];
    $scope.menuItems = menuManager.getDefaultItems();

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    // Declare form fields.
    $scope.photo = {
        value: '',
    };
    $scope.name = {
        name: 'name',
        label: $scope.lang.dishname,
        placeholder: $scope.lang.dishnameexample,
        validation: ['required', 'text'],
        value: ''
    };
    $scope.description = {
        name: 'description',
        label: $scope.lang.dishdescription,
        placeholder: $scope.lang.dishdescriptionexample,
        validation: ['text'],
        value: ''
    };
    $scope.groupid = {
        name: 'groupid',
        value: '',
    };
    $scope.when = {
        name: 'when',
        label: $scope.lang.when,
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
        value: 3,
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
        ]
    };
    // Fill up donations with country-dependant values.
    var donationOptions = statics.getDonationOptions();
    for(var i in donationOptions) {
        donationOptions[i].btnstyle = 'btn-warning';
        $scope.donation.options.push(donationOptions[i]);
    }

    // For updates.
    var id = urlParser.getParam('id');

    // We only support having one group membership.
    // No security issues on having the group in localStorage
    // as the groups info is public.
    var group = localStorage.getItem('group');
    if (group === null) {
        newLogRequest('redirected', 'groupMembers-add', 'index');
        redirecter.redirect('group-members/edit.html');
    }
    var groupInstance = JSON.parse(group);
    if (typeof groupInstance._id === 'undefined') {
        newLogRequest('redirected', 'groupMembers-add', 'index');
        redirecter.redirect('group-members/edit.html');
    }
    $scope.groupid.value = groupInstance._id;

    // Load the dish info.
    if (id) {
        appStatus.waiting('dishRequest');
        var dishCallback = function(dishData) {
            dishFormatter($scope, dishData);
            appStatus.completed('dishRequest');
        };
        dishRequest($scope, dishCallback, id);

        newLogRequest('view', 'dishes-edit', id);
    } else {
        // Just log the action.
        newLogRequest('view', 'dishes-add');
    }

    $scope.isEditing = function() {
        return (id);
    };

    $scope.save = function() {

        var dish = {};

        // Validate the form text forms, the other ones have a default value.
        if (!formsManager.validate(['name', 'description'], $scope)) {
            notifier.show($scope.lang.missingfields, $scope.lang.missingfieldsinfo);
            return;
        }

        // Edit mode.
        if (id) {
            dish.id = id;
        }

        // If we are adding the dish we should let the user confirm.
        if (!id) {
            notifier.showConfirm($scope.lang.confirmadddish, $scope.finallySave, dish);
        } else {
            $scope.finallySave(dish);
        }
    };

    $scope.finallySave = function(dish) {

        // Dish obj cleaning delegated to backend.
        var fields = [
            'name', 'description', 'groupid',
            'nportions', 'donation'];

        fields.forEach(function(field) {
            dish[field] = $scope[field].value;
        });

        // Adding the base64 photo.
        dish.photo = $scope.photo.value;

        // When.
        dish.when = datesConverter.dayToTime($scope.when.value);

        appStatus.waiting('editDishRequest');
        editDishRequest($scope, dish);

        if (id) {
            newLogRequest('click', 'dishes-edit-confirm');
        } else {
            newLogRequest('click', 'dishes-add-confirm');
        }
    };
}]);
