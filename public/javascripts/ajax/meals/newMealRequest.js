angular.module('eat-this-one')
    .factory('newMealRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, meal) {

        // Adding the session token to the request.
        meal.token = sessionManager.getToken();

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/meals',
            data : meal

        }).success(function(data) {

            var msg = 'Meal booked';
            notifier.show(msg, 'success');
            appStatus.completed();

        }).error(function(data, errorStatus, errorMsg) {

            var msg = 'Meal can not be added. "' + errorStatus + '": ' + errorMsg;
            notifier.show(msg, 'error');
            appStatus.completed();
        });
    };

}]);
