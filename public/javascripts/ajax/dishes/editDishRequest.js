angular.module('eat-this-one')
    .factory('editDishRequest', ['$window', '$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, $http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, dish) {

        // Defaults to new dish values.
        var method = 'POST';
        var url = '/dishes';
        if (typeof dish.id != 'undefined' && dish.id != null) {
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

            appStatus.completed();

            var title = '';
            var info = '';
            if (statusCode == 201) {
                // POST.
                title = $scope.lang.dishadded;
                info = $scope.lang.dishaddedinfo;
            } else {
                // PUT.
                title = $scope.lang.dishedited;
            }
            
            // Adding more info if unlimited was selected.
            if (data.nportions === 0) {
                info += "\n\n" + $scope.lang.unlimitedselected;
            }

            // Notify success.
            if (statusCode == 201) {
                // Share with users.
                var msg = '"' + data.user.name + '" ' + $scope.lang.sharedwithyou +
                    ': "' + data.name + '" .' +
                    "\n\n" + '"' + data.description + '"' +
                    "\n\n" + $scope.lang.downloadapp + "\n" + $scope.lang.android + ": " + eatConfig.downloadAppUrl;
                notifier.show(title, info, 'success', function(msg) {
                    $window.plugins.socialsharing.share(msg);
                });
            } else {
                notifier.show(title, info, 'success');
            }

            $window.location.href = 'index.html';

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errordishedit + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
