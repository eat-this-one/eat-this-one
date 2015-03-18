angular.module('eat-this-one').factory('messagesHandler', ['notifier', function(notifier) {

    return {
        androidMessage : function(msgData) {
            var message = '';

            // TODO i18n here too.
            // No default because I don't know WTF put in there.
            switch (msgData.type) {
                case 'newdish':
                    message = $.eatLang.lang.lnchef + ' ' + msgData.user +
                        ' ' + $.eatLang.lang.lncooked + ' ' + msgData.dish + '!';
                    break;
                case 'newmeal':
                    message = msgData.user + ' ' + $.eatLang.lang.lnbooked +
                        ' ' + msgData.dish + '. ' + $.eatLang.lang.lnremember;
                    break;
            }
            notifier.statusBar($.eatLang.lang.sitename, message, msgData.dishid);
        },

        iOSMessage : function(msgData) {
            // TODO See what this contains and what can we do with it.
            notifier.statusBar($.eatLang.lang.sitename, msgData.alert, 'FAKE');
        }
    };
}]);
