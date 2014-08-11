angular.module('eat-this-one')
    .factory('loginRequest', ['appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', function(appStatus, notifier, eatConfig, authManager, sessionManager) {

    return function($scope, $modalInstance, email, password) {

        // Using the website nothing will be send.
        var gcmregid = localStorage.getItem('gcmRegId');
        var requestData = {
            email : email,
            password : password,
            gcmregid : gcmregid
        };
        $.ajax({
            type : 'POST',
            url : eatConfig.backendUrl + '/login',
            data : requestData,
            datatype : 'json',
            success : function(data) {
                var msg = 'Log in successfully';
                notifier.show(msg, 'success');
                appStatus.completed();

                $modalInstance.close(true);

                authManager.authenticate();
                sessionManager.setUser(data);
            },
            error : function(data, errorStatus, errorMsg) {
                notifier.show(errorMsg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
