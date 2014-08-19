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
                notifier.show('You can not add a dish unless you are subscribed to a location', 'error');
                appStatus.completed();

            } else {
                
                // Populates the location field.
                for (var locIndex in data) {
                    $scope.locationid.options.push({
                        text: data[locIndex].name,
                        value: data[locIndex]._id
                    });
                }

                // Set the dish value when editing.

                // TODO This is dodgy as we don't know which request
                // will finish faster this should be using listeners.
                if ($scope.dish && $scope.dish.locationid) {
                    // TODO Check jQuery method as I am not sure about this.
                    $scope.locationid.options[$scope.dish.locationid].selected = 'selected';
                }
            }

            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {
            notifier.show(errorMsg, 'error');
            appStatus.completed();
        });
    };
}]);
