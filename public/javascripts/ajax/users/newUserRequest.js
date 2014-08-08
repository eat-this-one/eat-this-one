angular.module('eat-this-one')
    .factory('newUserRequest', ['appStatus', 'notifier', 'eatConfig', 'authManager', 'sessionManager', '$window', function(appStatus, notifier, eatConfig, authManager, sessionManager, $window) {

    return function($scope, $modalInstance, name, email, password) {

        var requestData = {
            name : name,
            email : email,
            password : password
        };
        $.ajax({
            type : 'POST',
            url : eatConfig.backendUrl + '/users',
            data : requestData,
            datatype : 'json',
            success : function(data) {

                var msg = 'Account successfully created';
                notifier.show(msg, 'success');

                authManager.authenticate();
                sessionManager.setUser(data);

                appStatus.completed();
                $modalInstance.close(true);

                $window.location.href = 'location-subscriptions/edit.html';
            },
            error : function(data, errorStatus, errorMsg) {
                notifier.show(errorMsg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
