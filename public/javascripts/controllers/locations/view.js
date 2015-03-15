angular.module('eat-this-one')
    .controller('LocationsViewController',
        ['$scope', 'authManager', 'redirecter', 'appStatus', 'notifier', 'eatConfig', 'newLogRequest', 'menuManager', 'urlParser', 'locationsRequest', function(
            $scope, authManager, redirecter, appStatus, notifier, eatConfig, newLogRequest, menuManager, urlParser, locationsRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header (the title will be replaced later by the location name).
    $scope.pageTitle = $scope.lang.location;
    $scope.menuItems = [
        menuManager.dishAddItem(),
        menuManager.dishesListItem(),
        menuManager.locationViewItem(),
        menuManager.feedbackItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }
    $scope.showMembers = false;

    var id = urlParser.getParam('id');

    // All location members (filled later only if the user is a member).
    $scope.members = [];

    appStatus.waiting('locationsRequest');

    var loc = localStorage.getItem('loc');
    if (loc === null) {
        newLogRequest('redirected', 'locationSubscriptions-add', 'locations-view');
        redirecter.redirect('location-subscriptions/edit.html');
    }
    loc = JSON.parse(loc);

    var locationCallback = function(locations) {

        if (locations.length === 0) {
            return errorCallback(null, 404, $scope.lang.locationnoexists + ' ' + id);
        }

        // Fetching by id we should have just one.
        var locData = locations[0];

        $scope.pageTitle = locData.name;

        // If you can see the members you are one of them.
        if (typeof locData.members !== "undefined") {
            $scope.members = locData.members;
            $scope.showMembers = true;
            $scope.actionIcons = [
                {
                    name : $scope.lang.invitepeople,
                    icon : 'glyphicon glyphicon-plus',
                    callback : 'inviteMembers'
                }
            ];
        }
        appStatus.completed('locationsRequest');
    };

    var errorCallback = function(data, errorStatus, errorMsg) {

        // On unauthorized access we redirect to the index.
        if (errorStatus === 401) {
            newLogRequest('redirected', 'index', 'location-view');
            redirecter.redirect('index.html');
        } else if (errorStatus === 404) {
            appStatus.completed('locationsRequest');
            notifier.show($scope.lang.locationnoexists, '', function() {
                redirecter.redirect('index.html');
            });
        } else {
            appStatus.completed('locationsRequest');
            newLogRequest('error', 'location-view', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        }
    };

    // We check the permissions in the backend, if the user
    // is not a member we will only return the location data, not members.
    locationsRequest($scope, {id: id}, locationCallback, errorCallback);

    // Redirects to invite people to the location page.
    $scope.inviteMembers = function() {
        newLogRequest('click', 'location-share', id);
        redirecter.redirect('location/share.html?id=' + id);
    };

    newLogRequest('view', 'location-view', id);
}]);
