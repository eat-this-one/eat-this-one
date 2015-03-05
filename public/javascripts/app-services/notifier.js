angular.module('eat-this-one').factory('notifier', ['redirecter', '$mdDialog', function(redirecter, $mdDialog) {
    return {

        dialog : null,

        // Exactly the same method for both web and app.
        show : function(title, msg, callback) {

            if (typeof callback == 'undefined') {
                callback = function() {};
            }

            dialog = $mdDialog.alert()
                .title(title)
                .content(msg)
                .ok($.eatLang.lang.alertcontinue);
            $mdDialog.show(dialog)
                .finally(callback);
        },

        statusBar : function(title, message, type, dishid) {

            var msgid = Math.random() * 1000;

            document.addEventListener('deviceready', function() {
                window.plugin.notification.local.add({
                    id : msgid,
                    title : title,
                    message : message,
                    json : { dishid : dishid, type: type},
                });

                // TODO Not always working.
                // Move to the requested page.
                window.plugin.notification.local.onclick = function(msgid, state, json) {
                    var dishid = JSON.parse(json).dishid;
                    // TODO We need to log this, but we are having
                    // a circular dependency on sessionManager.
                    //newLogRequest('click', 'notification', dishid);
                    redirecter.redirect('dishes/view.html?id=' + dishid);
                };
            });
        }
    };
}]);
