angular.module('eat-this-one')
    .factory('newLocationSubscriptionRequest', ['appStatus', 'notifier', 'eatConfig', 'sessionManager', function(appStatus, notifier, eatConfig, sessionManager) {

        return function($modalInstance, locationid) {
            $.ajax({
                type : 'POST',
                url : eatConfig.backendUrl + '/location-subscriptions',
                data : {
                    locationid : locationid,
                    token : sessionManager.getToken()
                },
                datatype : 'json',
                success : function(data) {
                    var msg = 'Subscribed!';
                    notifier.show(msg, 'success');
                    appStatus.completed();

                    $modalInstance.close(true);
                },
                error : function(data, errorStatus, errorMsg) {
                    notifier.show(errorMsg, 'error');
                    appStatus.completed();
                }
            });
        };
}]);
