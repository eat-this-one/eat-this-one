angular.module('eat-this-one')
    .factory('newLocationRequest', ['appStatus', 'notifier', 'eatConfig', 'sessionManager', function(appStatus, notifier, eatConfig, sessionManager) {

        return function($modalInstance, name, address) {
            $.ajax({
                type : 'POST',
                url : eatConfig.backendUrl + '/locations',
                data : {
                    name : name,
                    address : address,
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
