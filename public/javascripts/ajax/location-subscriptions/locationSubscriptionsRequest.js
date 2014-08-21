angular.module('eat-this-one')
    .factory('locationSubscriptionsRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope) {

        $http({
            method : 'GET',
            url : eatConfig.backendUrl + '/location-subscriptions',
            params : {
                token : sessionManager.getToken()
            }

        }).success(function(data) {

            // If there are no subscriptions.
            if (data.length === 0) {
                notifier.show($scope.lang.nosubscriptions, $scope.lang.nosubscriptionsinfo, 'error');

            } else {
                
                // Populates the location field.
                for (var locIndex in data) {
                    $scope.locationid.options.push({
                        text: data[locIndex].name,
                        value: data[locIndex]._id
                    });
                }

                // If there is just 1 result select it.
                if ($scope.locationid.options.length === 1) {
                    $('#id-locationid option[value="' + $scope.locationid.options[0].value + '"]').prop('selected', true);
                    $scope.locationid.value = $scope.locationid.options[0].value;
                    $('#id-locationid').prop('disabled', true);
                }
            }

            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            notifier.show($scope.lang.error, errorMsg, 'error');
        });
    };
}]);
