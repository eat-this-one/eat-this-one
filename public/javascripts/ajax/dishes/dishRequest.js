angular.module('eat-this-one')
    .factory('dishRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'mapsManager', function($http, appStatus, notifier, eatConfig, mapsManager) {

    return function($scope, id) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/dishes/' + id

        }).success(function(dishData) {

            $scope.dish = dishData;
            $scope.dish.map = mapsManager.getStaticMap($scope.dish.loc.address);

            // Fill form values if they exist.
            var fields = ['userid', 'name', 'description', 'nportions', 'donation'];
            for (var fieldName in fields) {
                if ($scope[fields[fieldName]]) {
                    $scope[fields[fieldName]].value = $scope.dish[fields[fieldName]];
                }
            }

            // Only available when editing dishes.
            if ($scope.when) {
                var now = new Date();
                var today = Date.UTC(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                );
                var dbtime = Date.parse($scope.dish.when);
                if (dbtime == today) {
                    $scope.when.value = 'today';
                } else if (dbtime == today + (24 * 60 * 60 * 1000)) {
                    $scope.when.value = 'tomorrow';
                } else if (dbtime == today + (2 * 24 * 60 * 60 * 1000)) {
                    $scope.when.value = 'aftertomorrow';
                } else {
                    // If it is a passed event we should not arrive here
                    // but let's offer an option as this app is pretty buggy
                    // at the moment and we never know.
                    $scope.when.value = 'today';
                }
            }

            // Only available when editing dishes.
            // The photo is not required so it may not be there, then we allow one to be added.
            if ($scope.dish.photo) {
                $('#id-photobtn').css('display', 'none');
                var smallimage = $('#id-smallimage');
                smallimage.css('display', 'block');
                // Image already returns prefixed with ...jpeg:base64;.
                smallimage.prop('src', $scope.dish.photo);
            }

            appStatus.completed('dishRequest');

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            var msg = $scope.lang.errordishrequest + '. "' + errorStatus + '": ' + data;
            notifier.show($scope.lang.error, msg, 'error');
        });
    };

}]);
