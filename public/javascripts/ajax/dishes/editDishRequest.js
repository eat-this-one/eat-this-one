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

            // If it is a dish edit we just redirect the user to index.
            if (statusCode == 200) {
                $window.location.href = 'index.html';

            } else if (statusCode == 201) {

                // When adding a new dish we always notify the success,
                // but if this is the first dish the user is adding we
                // should also give him/her the option to add more colleagues.
                notifier.show(title, info, 'success');

                if (data.user.dishescount == 1) {
                    // After adding the first dish we allow people to
                    // add their contacts to his/her location.
                    var shareArguments = '?dishname=' + data.name +
                        '&username=' + data.user.name +
                        '&locationname=' + data.loc.name;
                    $window.location.href = 'dishes/share.html' + shareArguments;
                } else {
                    $window.location.href = 'index.html';
                }
            }

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errordishedit + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
