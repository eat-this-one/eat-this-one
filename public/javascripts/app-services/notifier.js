angular.module('eat-this-one').factory('notifier', function() {
    return {

        // UNUSED type
        show : function(title, msg, type) {

            document.addEventListener('deviceready', function() {
                navigator.notification.alert(
                    msg,
                    function(){},
                    title,
                    $.eatLang.lang.alertcontinue
                );
            }, true);
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
                window.plugin.notification.local.onclick = function(id, state, json) {
                    var href = 'dishes/view.html?id=' +JSON.parse(json).dishid;
                    console.log('Notification clicked, user redirected to ' + href);
                    window.location.href = href;
                };
            });
        }
    }
});
