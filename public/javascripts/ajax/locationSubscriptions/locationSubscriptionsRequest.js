angular.module('eat-this-one')
    .factory('locationSubscriptionsRequest', ['appStatus', 'notifier', 'eatConfig', 'sessionManager', function(appStatus, notifier, eatConfig, sessionManager) {

        return function($scope) {
            $.ajax({
                type : 'GET',
                url : eatConfig.backendUrl + '/location-subscriptions',
                data : {
                    token : sessionManager.getToken()
                },
                datatype : 'json',
                success : function(data) {

                    // If there are no subscriptions.
                    if (data.length === 0) {
                        $scope.showAddLocation = true;
                    } else {
                        
                        // Populates the location field.
                        for (var locIndex in data) {
                            $scope.loc.options.push({
                                text: data[locIndex].name,
                                value: data[locIndex]._id
                            });
                        }
                        $scope.showAddLocation = false;
                    }

                    $scope.$apply();
                    appStatus.completed();
                },
                error : function(data, errorStatus, errorMsg) {
                    notifier.show(errorMsg, 'error');
                    appStatus.completed();
                }
            });
        };
}]);
