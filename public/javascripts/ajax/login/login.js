angular.module('eat-this-one')
    .factory('loginRequest', ['appStatus', 'notifier', 'eatConfig', 'eatAuth', function(appStatus, notifier, eatConfig, eatAuth) {

    return function($scope, $modalInstance, email, password) {

        var requestData = {
            email : email,
            password : password
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

                eatAuth.authenticate(data);
            },
            error : function(data, errorStatus, errorMsg) {
                notifier.show(errorMsg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
