angular.module('eat-this-one')
    .controller('GroupsViewController',
        ['$scope', '$filter', 'authManager', 'redirecter', 'appStatus', 'notifier', 'eatConfig', 'newLogRequest', 'menuManager', 'urlParser', 'groupsRequest', 'userManager', function(
            $scope, $filter, authManager, redirecter, appStatus, notifier, eatConfig, newLogRequest, menuManager, urlParser, groupsRequest, userManager) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header (the title will be replaced later by the group name).
    $scope.pageTitle = $scope.lang.ranking;
    $scope.menuItems = menuManager.getDefaultItems();

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }
    $scope.showMembers = false;

    var id = urlParser.getParam('id');

    // All group members (filled later only if the user is a member).
    $scope.members = [];

    appStatus.waiting('groupsRequest');

    var group = localStorage.getItem('group');
    if (group === null) {
        newLogRequest('redirected', 'groupMembers-add', 'groups-view');
        redirecter.redirect('group-members/edit.html');
    }
    group = JSON.parse(group);

    var groupCallback = function(groups) {

        if (groups.length === 0) {
            return errorCallback(null, 404, $scope.lang.groupnoexists + ' ' + id);
        }

        // Fetching by id we should have just one.
        var groupData = groups[0];

        $scope.pageTitle = $scope.pageTitle + ' - ' + groupData.name;

        // If you can see the members you are one of them.
        if (typeof groupData.members !== "undefined") {

            // Order them by points.
            groupData.members = $filter('orderBy')(groupData.members, '-user.points');

            var lastUserPoints = null;
            var lastUserRanking = null;
            var nextUserRanking = 1;
            for(var i in groupData.members) {
                if (lastUserPoints === null) {
                    groupData.members[i].user.ranking = 1;
                } else if (groupData.members[i].user.points === lastUserPoints) {
                    groupData.members[i].user.ranking = groupData.members[i-1].user.ranking;
                } else {
                    groupData.members[i].user.ranking = nextUserRanking;
                }
                nextUserRanking++;

                lastUserPoints = groupData.members[i].user.points;
                // TODO Change this along with the ng-repeat, it's 5am and I'm sleepy...
                groupData.members[i].user.stars = [];
                for (var n = 0; n < groupData.members[i].user.points; n++) {
                    groupData.members[i].user.stars.push(n);
                }
            }
            $scope.members = groupData.members;

            // Try to get gravatar pictures.
            for (var m = 0; m < $scope.members.length; m++) {
                userManager.loadPicture($scope.members[m].user);
            }

            $scope.showMembers = true;
            $scope.actionIcons = [
                {
                    name : $scope.lang.invitepeople,
                    icon : 'glyphicon glyphicon-plus',
                    callback : 'inviteMembers'
                }
            ];
        }
        appStatus.completed('groupsRequest');
    };

    var errorCallback = function(data, errorStatus, errorMsg) {

        // On unauthorized access we redirect to the index.
        if (errorStatus === 401) {
            newLogRequest('redirected', 'index', 'group-view');
            redirecter.redirect('index.html');
        } else if (errorStatus === 404) {
            appStatus.completed('groupsRequest');
            notifier.show($scope.lang.groupnoexists, '', function() {
                redirecter.redirect('index.html');
            });
        } else {
            appStatus.completed('groupsRequest');
            newLogRequest('error', 'group-view', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        }
    };

    // We check the permissions in the backend, if the user
    // is not a member we will only return the group data, not members.
    groupsRequest($scope, {id: id}, groupCallback, errorCallback);

    // Redirects to invite people to the group page.
    $scope.inviteMembers = function() {
        newLogRequest('click', 'group-share', id);
        redirecter.redirect('groups/share.html?id=' + id);
    };

    newLogRequest('view', 'group-view', id);
}]);
