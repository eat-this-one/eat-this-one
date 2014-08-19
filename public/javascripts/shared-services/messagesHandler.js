angular.module('eat-this-one').factory('messagesHandler', ['notifier', function(notifier) {

    return {
        message : function(msgData) {
            notifier.statusBar('Eat this one', msgData.message);
        }
    }
}]);
