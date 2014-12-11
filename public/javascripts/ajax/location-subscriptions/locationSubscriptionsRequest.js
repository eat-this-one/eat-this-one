// UNUSED
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

                // Wait 1 second.
                setTimeout(function() {
                    window.location.href = 'location-subscriptions/edit.html';
                }, 1000);
            } else {
                
                // Populates the location field.
                for (var locIndex in data) {
                    $scope.locationid.options.push({
                        text: data[locIndex].name,
                        value: data[locIndex]._id
                    });
                }

                // We use the first one.
                $scope.locationid.value = data[0]._id;
            }

            appStatus.completed('locationSubscriptionsRequest');

        }).error(function(data, errorStatus, errorMsg) {
            appStatus.completed();
            notifier.show($scope.lang.error, data, 'error');
        });
    };
}]);
