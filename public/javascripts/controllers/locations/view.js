angular.module('eat-this-one')
    .controller('LocationsViewController',
        ['$scope', '$filter', 'authManager', 'redirecter', 'appStatus', 'notifier', 'eatConfig', 'newLogRequest', 'menuManager', 'urlParser', 'locationsRequest', function(
            $scope, $filter, authManager, redirecter, appStatus, notifier, eatConfig, newLogRequest, menuManager, urlParser, locationsRequest) {

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

            // Order them by points.
            locData.members = $filter('orderBy')(locData.members, '-user.points');

            var lastUserPoints = null;
            var lastUserRanking = null;
            var nextUserRanking = 1;
            for(var i in locData.members) {
                if (lastUserPoints === null) {
                    locData.members[i].user.icon = 'king';
                    locData.members[i].user.ranking = 1;
                } else if (locData.members[i].user.points === lastUserPoints) {
                    locData.members[i].user.icon = locData.members[i-1].user.icon;
                    locData.members[i].user.ranking = locData.members[i-1].user.ranking;
                } else {
                    locData.members[i].user.icon = 'user';
                    locData.members[i].user.ranking = nextUserRanking;
                }
                nextUserRanking++;

                lastUserPoints = locData.members[i].user.points;
                // TODO Change this along with the ng-repeat, it's 5am and I'm sleepy...
                locData.members[i].user.stars = [];
                for (var n = 0; n < locData.members[i].user.points; n++) {
                    locData.members[i].user.stars.push(n);
                }
            }
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
        redirecter.redirect('locations/share.html?id=' + id);
    };

    newLogRequest('view', 'location-view', id);
}]);
