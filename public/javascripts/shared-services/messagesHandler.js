angular.module('eat-this-one').factory('messagesHandler', ['notifier', function(notifier) {

    return {
        message : function(msgData) {
            notifier.statusBar(msgData.title, msgData.text, msgData.type, msgData.dishid);
        }
    };
}]);
