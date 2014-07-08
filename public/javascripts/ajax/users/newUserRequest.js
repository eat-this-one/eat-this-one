angular.module('eat-this-one')
    .factory('newUserRequest', ['appStatus', 'notifier', 'eatConfig', function(appStatus, notifier, eatConfig) {

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
