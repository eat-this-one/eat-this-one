angular.module('eat-this-one')
    .factory('editDishRequest', ['redirecter', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', 'storage', 'newLogRequest', function(redirecter, $http, appStatus, notifier, eatConfig, sessionManager, storage, newLogRequest) {

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

        $http({
            method : method,
            url : eatConfig.backendUrl + url,
            data : dish

        }).success(function(data, statusCode) {

            appStatus.completed('editDishRequest');

            // Add the dish to the cached list of my dishes.
            storage.add('mydishes', data._id);

            var title = '';
            var info = '';
            if (statusCode == 201) {
                // POST.
                newLogRequest('created', 'dish', data._id);

                title = $scope.lang.dishadded;

                // The current user will be subscribed, so more than 1.
                if (data.nsubscribers <= 1) {
                    info = $scope.lang.dishaddednomembersinfo + '.';
                } else {
                    info = $scope.lang.dishaddednotifiedinfo + '.';
                    // If it is the first dish the user adds we let him know
                    // that it will be redirected to invited more people.
                    if (data.user.dishescount === 1) {
                        info = info + ' ' + $scope.lang.dishaddedfirstinvites + '.';
                    }
                }
            } else {
                // PUT.
                newLogRequest('updated', 'dish', data._id);

                title = $scope.lang.dishedited + '.';
            }

            // Adding more info if unlimited was selected.
            if (data.nportions === 0) {
                info += "\n\n" + $scope.lang.unlimitedselected;
            }

            // If it is a dish edit we just redirect the user to index.
            if (statusCode == 200) {
                redirecter.redirect('index.html');

            } else if (statusCode == 201) {

                // When adding a new dish we always notify the success,
                // but if this is the first dish the user is adding we
                // should also give him/her the option to invite more people.
                notifier.show(title, info, function() {

                    if (data.user.dishescount == 1 || data.nsubscribers <= 1) {
                        // After adding the first dish we propose people to
                        // add their contacts to their location.
                        // If there are no subscriptors the user needs to contact more
                        // people, otherwise it is not worth to share the dish with nobody.
                        redirecter.redirect('dishes/share.html?dishname=' + data.name);
                    } else {
                        // TODO Maybe an extra confirm to let the user choose if
                        // he/she wants to add more colleagues.
                        redirecter.redirect('index.html');
                    }
                });
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed('editDishRequest');
            newLogRequest('error', 'dish-edit', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        });
    };

}]);
