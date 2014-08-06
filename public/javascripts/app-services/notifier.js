angular.module('eat-this-one').factory('notifier', function() {
    return {

        show : function() {
            // TODO apps uses native dialogues
        },

        statusBar : function(title, message) {
            window.plugin.notification.local.add({
                id : 1,
                title : title,
                message : message
            });
        }
    }
});
