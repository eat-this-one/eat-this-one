angular.module('eat-this-one')
    .factory('newLocationRequest', ['$window', 'appStatus', 'notifier', 'eatConfig', 'sessionManager', function($window, appStatus, notifier, eatConfig, sessionManager) {

        return function(name, address) {
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
                    //var msg = 'Subscribed!';
                    //notifier.show(msg, 'success');
                    //appStatus.completed();
                    $window.location.href = 'index.html';
                },
                error : function(data, errorStatus, errorMsg) {
                    notifier.show(errorMsg, 'error');
                    appStatus.completed();
                }
            });
        };
}]);
