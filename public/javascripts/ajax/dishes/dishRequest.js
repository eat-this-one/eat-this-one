angular.module('eat-this-one')
    .factory('dishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'mapsManager', 'datesConverter', 'sessionManager', function($http, appStatus, notifier, eatConfig, mapsManager, datesConverter, sessionManager) {

    return function($scope, id) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id,
            params : { token : sessionManager.getToken() }

        }).success(function(dishData) {

            $scope.dish = dishData;
            $scope.dish.map = mapsManager.getStaticMap($scope.dish.loc.address);

            // Nice when format.
            $scope.dish.when = datesConverter.timeToDay(Date.parse($scope.dish.when));

            // Fill form values if they exist.
            var fields = ['userid', 'name', 'description', 'when', 'nportions', 'donation'];
            for (var fieldName in fields) {
                if ($scope[fields[fieldName]]) {
                    $scope[fields[fieldName]].value = $scope.dish[fields[fieldName]];
                }
            }

            // Chef name requires special treatment.
            if ($scope.dish.username === 'deleted') {
                $scope.dish.username = $scope.lang.deleteduser;
            }

            // The photo is not required so it may not be there.
            if ($scope.dish.photo) {
                var smallimage = $('#id-smallimage');
                smallimage.css('display', 'block');
                // Image already returns prefixed with ...jpeg:base64;.
                smallimage.prop('src', $scope.dish.photo);
            }

            // Number of remaining portions to book.
            if ($scope.dish.nportions == 0) {
                // No text as they are unlimited, rendundant info.
                $scope.dish.remainingportions = -1;
            } else {
                $scope.dish.remainingportions = $scope.dish.nportions - dishData.bookedmeals;
                if ($scope.dish.remainingportions == 1) {
                    // Show last portion text.
                    $scope.remainingportionstext = $scope.lang.onlyoneportion;
                } else if ($scope.dish.remainingportions == 0) {
                    // Show all booked text.
                    $scope.remainingportionstext = $scope.lang.allportionsbooked;
                } else {
                    // No text if more than one portion.
                }
            }

            // Set the page title.
            $scope.pageTitle = $scope.dish.name;

            appStatus.completed('dishRequest');

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errordishrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
