angular.module('eat-this-one')
    .factory('addFeedbackRequest', ['$http', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($http, appStatus, notifier, eatConfig, sessionManager) {

    return function($scope, feedback, feedbackCallback, feedbackErrorCallback) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/feedback',
            data : {
                token : sessionManager.getToken(),
                feedback : feedback
            }

        })
        .success(feedbackCallback)
        .error(feedbackErrorCallback);
    };

}]);
