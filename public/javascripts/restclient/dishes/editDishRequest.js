angular.module('eat-this-one')
    .factory('editDishRequest', ['redirecter', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', 'storage', 'newLogRequest', 'statics', 'shareManager',
    function(redirecter, $http, appStatus, notifier, eatConfig, sessionManager, storage, newLogRequest, statics, shareManager) {

    // Not using callbacks as it would be hardly reusable.
    return function($scope, dish) {

        // Defaults to new dish values.
        var method = 'POST';
        var url = '/dishes';
        if (typeof dish.id !== "undefined" &&
                dish.id !== null &&
                dish.id !== false) {
            method = 'PUT';
            url = '/dishes/' + dish.id;
        }

        // Adding the session token to the request.
        dish.token = sessionManager.getToken();

        // Here we use the group country to determine
        // the default group language, which all group
        // members are supposed to understand.
        var locLang = statics.getGroupLanguage();
        dish.message = $.eatLang[locLang].lnchef + ' ' +
            sessionManager.getUser().name +
            ' ' + $.eatLang[locLang].lncooked + ' ' + dish.name + '!';

        $http({
            method : method,
            url : eatConfig.backendUrl + url,
            data : dish

        }).success(function(data, statusCode) {

            // Add the dish to the cached list of my dishes.
            storage.add('mydishes', data._id);

            if (localStorage.getItem('disableTips') === null) {
                // We disable the tips once the user added the first dish.
                localStorage.setItem('disableTips', true);
            }

            var title = '';
            var info = '';
            if (statusCode == 201) {
                // POST.
                newLogRequest('created', 'dish', data._id);

                title = $scope.lang.dishadded;

                // The current user will be a member, so more than 1.
                if (data.nmembers <= 1) {
                    info = $scope.lang.dishaddednomembersinfo + '.';
                } else if (data.user.dishescount === 1) {
                    // If it is the first dish the user adds we let him know
                    // that it will be redirected to invited more people.
                    info = $scope.lang.dishaddedfirstinvites + '.';
                }
            } else {
                // PUT.
                newLogRequest('updated', 'dish', data._id);
            }

            // Adding more info if unlimited was selected.
            if (data.nportions === 0) {
                info += " " + $scope.lang.unlimitedselected;
            }

            // If it is a dish edit we just redirect the user to index.
            if (statusCode == 200) {
                redirecter.redirect('index.html');

            } else if (statusCode == 201) {

                // Only if there is something to report.
                if (!info) {
                    redirecter.redirect('index.html');
                } else {
                    // We set it completed when there is no redirection.
                    var group = JSON.parse(localStorage.getItem('group'));
                    var msg = $scope.lang.invitejoinmygroup + ' .' + $scope.lang.invitegroupcode +
                         ': "' + group.code + '". ' + eatConfig.downloadAppUrl;
                    shareManager.share(msg);

                    // Give some time to share plugin to start as otherwise the user
                    // may accept the alert before share appears.
                    setTimeout(function() {
                        appStatus.completed('editDishRequest');
                        notifier.show(title, info, redirecter.redirect);
                    }, 300);
                }
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed('editDishRequest');
            newLogRequest('error', 'dish-edit', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        });
    };

}]);
