angular.module('eat-this-one')
    .factory('dishRequest', ['appStatus', 'notifier', function(appStatus, notifier) {

    return function($scope, id) {

        $.ajax({
            type : 'GET',
            url : $.eatConfig.backendUrl + '/dishes/' + id,
            datatype : 'json',
            success : function(dishData) {
                $scope.dish = $.parseJSON(dishData);
                appStatus.completed();
            },
            error : function(data, errorStatus, errorMsg) {
                var msg = 'Dish data can not be obtained. "' + errorStatus + '": ' + errorMsg;
                notifier.show(msg, 'error');
                appStatus.completed();
            }
        });
    };

}]);
