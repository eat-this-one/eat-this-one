angular.module('eat-this-one').factory('notifier', function() {
    return {

        show : function() {
            // TODO apps uses native dialogues
        },

        statusBar : function(title, message, type, dishid) {

            var msgid = Math.rand() * 1000;

            window.plugin.notification.local.add({
                id : msgid,
                title : title,
                message : message,
                json : { dishid : dishid, type: type},
            });

            // TODO Not working.
            // Move to the requested page.
            window.plugin.notification.local.onclick = function(id, state, json) {
                window.location.href = 'dishes/view.html?id=' + json.dishid;
            };
        }
    }
});
